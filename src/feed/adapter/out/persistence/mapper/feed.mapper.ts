import { Feed } from "src/feed/domain/feed.entity";
import { CallRoom, RoomStatus as DomainRoomStatus } from "src/feed/domain/call-room.entity";
import { Feed as PrismaFeed, CallRoom as PrismaCallRoom, RoomStatus as PrismaRoomStatus } from '@prisma/client';

type PrismaFeedWithCallRoom = PrismaFeed & { callRoom?: PrismaCallRoom | null };

export class FeedMapper {

    // 1. DB 모델 -> 순수 도메인 엔티티 (Restore)
    static toDomain(prismaFeed: PrismaFeedWithCallRoom): Feed {
        let callRoom: CallRoom | undefined;

        if (prismaFeed.callRoom) {
            callRoom = CallRoom.restore({
                id: prismaFeed.callRoom.id,
                feedId: prismaFeed.callRoom.feedId,
                maxParticipants: prismaFeed.callRoom.maxParticipants,
                currentParticipants: prismaFeed.callRoom.currentParticipants,
                // Enum 통역
                status: prismaFeed.callRoom.status === PrismaRoomStatus.OPEN
                    ? DomainRoomStatus.OPEN
                    : DomainRoomStatus.CLOSED,
                createdAt: prismaFeed.callRoom.createdAt,
            });
        }

        return Feed.restore({
            id: prismaFeed.id,
            authorId: prismaFeed.authorId,
            content: prismaFeed.content,
            createdAt: prismaFeed.createdAt,
            updatedAt: prismaFeed.updatedAt,
            callRoom: callRoom || null,
        });
    }

    // 2. 순수 도메인 엔티티 -> DB 저장용 객체 변환
    static toPersistence(feed: Feed) {
        // getProps() 대신 public 필드에 바로 접근 (엔티티 설계에 따라 선택)
        return {
            id: feed.id,
            authorId: feed.authorId,
            content: feed.content,
            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
            // DB 저장을 위해 CallRoom 데이터도 함께 빼줍니다.
            callRoom: feed.callRoom ? {
                id: feed.callRoom.id,
                status: feed.callRoom.status === DomainRoomStatus.OPEN
                    ? PrismaRoomStatus.OPEN
                    : PrismaRoomStatus.CLOSED,
                maxParticipants: feed.callRoom.maxParticipants,
                currentParticipants: feed.callRoom.currentParticipants,
            } : null
        };
    }
}