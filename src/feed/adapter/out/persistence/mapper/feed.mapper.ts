import { Feed } from "src/feed/domain/feed.entity";
import { CallRoom, RoomStatus } from "src/feed/domain/call-room.entity";
import { Feed as PrismaFeed, CallRoom as PrismaCallRoom, User as PrismaUser } from '@prisma/client';

// 1. Prisma 조회 시 사용될 완벽한 교집합 타입 정의
// User 테이블에서 우리가 필요한 필드만 가져온다고 가정
export type PrismaFeedWithRelations = PrismaFeed & {
    callRoom: PrismaCallRoom | null;
    author: Pick<PrismaUser, 'nickname' | 'handle'>;
};

export class FeedMapper {

    // 1. DB 모델 -> 순수 도메인 엔티티 (Restore)
    static toDomain(prismaFeed: PrismaFeedWithRelations): Feed {
        const callRoom = prismaFeed.callRoom
            ? CallRoom.restore({
                id: prismaFeed.callRoom.id,
                feedId: prismaFeed.callRoom.feedId,
                status: prismaFeed.callRoom.status as RoomStatus,
                maxParticipants: prismaFeed.callRoom.maxParticipants,
                currentParticipants: prismaFeed.callRoom.currentParticipants,
                createdAt: prismaFeed.callRoom.createdAt,
            })
            : null

        // 2. 타입 에러 없이 안전하게 작성자 정보 매핑
        return Feed.restore({
            id: prismaFeed.id,
            content: prismaFeed.content,
            authorId: prismaFeed.authorId,
            authorNickname: prismaFeed.author.nickname || 'Unknown',
            authorHandle: prismaFeed.author.handle || 'Unknown',
            callRoom: callRoom,
            likeCount: prismaFeed.likeCount,
            createdAt: prismaFeed.createdAt,
            updatedAt: prismaFeed.updatedAt,
            deletedAt: prismaFeed.deletedAt,
        });
    }

    // 3. 순수 도메인 엔티티 -> DB 저장용 객체 변환
    // 반환 타입을 명시하여 Primsa가 요구하는 정확한 형태 전달
    static toPersistence(feed: Feed): Omit<PrismaFeed, 'id'> & { id?: string } {
        // getProps() 대신 public 필드에 바로 접근 (엔티티 설계에 따라 선택)
        return {
            id: feed.id || undefined, // Prisma에서 새 레코드 생성 시 id가 undefined여야 default(uuid())가 작동함
            content: feed.content,
            likeCount: feed.likeCount,
            authorId: feed.authorId,
            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
            deletedAt: feed.deletedAt,
        };
    }
}