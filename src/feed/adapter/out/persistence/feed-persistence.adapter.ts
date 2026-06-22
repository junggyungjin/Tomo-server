import { Injectable } from "@nestjs/common";
import { FeedRepositoryPort } from "src/feed/application/ports/out/feed.repository.port";
import { PrismaService } from "src/prisma/prisma.service";
import { Feed } from "src/feed/domain/feed.entity";
import { FeedMapper } from "./mapper/feed.mapper";

@Injectable()
export class FeedPersistenceAdapter implements FeedRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(feed: Feed): Promise<Feed> {
        const persistenceData = FeedMapper.toPersistence(feed);

        // Mapper의 반환 객체에는 callRoom이 없으므로 도메인 객체에서 직접 참조
        const callRoomData = feed.callRoom;

        let savedPrismaFeed;

        // ID가 없으면 새로운 피드이므로 DB에 새로 생성(Create)
        if (!persistenceData.id) {
            savedPrismaFeed = await this.prisma.feed.create({
                data: {
                    // ID는 Prisma(PostgreSQL)가 알아서 uuid로 생성
                    authorId: persistenceData.authorId,
                    content: persistenceData.content,
                    likeCount: persistenceData.likeCount,

                    // 도메인 객체의 callRoom 데이터가 있다면 Nested Create로 한 번에 저장
                    ...(callRoomData && {
                        callRoom: {
                            create: {
                                maxParticipants: callRoomData.maxParticipants,
                                currentParticipants: callRoomData.currentParticipants,
                                status: callRoomData.status,
                            },
                        },
                    }),
                },
                include: {
                    callRoom: true, // 생성 후 통화방 데이터까지 묶어서 반환받음
                    author: { select: { nickname: true, handle: true } },
                },
            });
        }
        // ID가 있으면 기존 피드 수정이므로 업데이트(Update)
        else {
            savedPrismaFeed = await this.prisma.feed.update({
                where: { id: persistenceData.id },
                data: {
                    content: persistenceData.content,
                    likeCount: persistenceData.likeCount, // 도메인에서 변경된 좋아요 수 반영
                    deletedAt: persistenceData.deletedAt, // 도메인에서 삭제 처리된 경우 반영
                    // 통화방 인원 변동 등 추가 업데이트가 필요하다면 여기에 로직 추가
                },
                include: {
                    callRoom: true,
                    author: { select: { nickname: true, handle: true } }, // Mapper 타입에 맞게 최적화
                },
            });
        }

        // DB 저장이 끝난 데이터를 다시 순수 도메인 객체로 넘겨 줌
        return FeedMapper.toDomain(savedPrismaFeed);
    }

    async findById(id: string, viewerId?: string): Promise<Feed | null> {
        // findUnique는 고유키만 조건으로 받으므로, deletedAt: null 필터링을 위해 findFirst 사용
        const prismaFeed = await this.prisma.feed.findFirst({
            where: {
                id,
                deletedAt: null // 삭제하지 않은 피드만 조회
            },
            include: {
                callRoom: true,
                author: {
                    select: { nickname: true, handle: true }
                },
                // viewerId가 전달되었을 때만, 해당 유저가 누른 좋아요 내역을 Left Join으로 함꼐 가져옴
                ...(viewerId && {
                    feedLikes: {
                        where: {
                            userId: viewerId,
                            deletedAt: null
                        },
                        select: { id: true } // 존재 여부만 확인하면 되므로 id만 최소한으로 Select
                    }
                })
            },
        });

        if (!prismaFeed) return null;

        return FeedMapper.toDomain(prismaFeed);
    }

    async findAll(viewerId?: string): Promise<Feed[]> {
        const prismaFeeds = await this.prisma.feed.findMany({
            where: { deletedAt: null }, // 삭제되지 않은 피드만 조회
            orderBy: { createdAt: 'desc' }, // 보통 피드는 최신순(내림차순)으로 정렬
            include: {
                callRoom: true,
                author: { select: { nickname: true, handle: true } },
                // N+1 문제 방지를 위해, 피드 목록을 가져올 때 내가 누른 좋아요도 한번에 가져옴
                ...(viewerId && {
                    feedLikes: {
                        where: {
                            userId: viewerId,
                            deletedAt: null
                        },
                        select: { id: true }
                    }
                })
            },
        });

        return prismaFeeds.map(prismaFeed => FeedMapper.toDomain(prismaFeed));
    }

    async toggleLike(userId: string, feedId: string, isLike: boolean): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            if (isLike) {
                // 1. 좋아요 데이터 Upsert
                await tx.feedLike.upsert({
                    where: { userId_feedId: { userId, feedId } },
                    create: { userId, feedId },
                    update: { deletedAt: null, createdAt: new Date() },
                });
                // 2. 카운트 증가
                await tx.feed.update({
                    where: { id: feedId },
                    data: { likeCount: { increment: 1 } },
                });
            } else {
                // 1. 좋아요 데이터 Soft Delete
                await tx.feedLike.update({
                    where: { userId_feedId: { userId, feedId } },
                    data: { deletedAt: new Date() },
                });
                // 2. 카운트 감소 (음수 방지 로직 포함)
                await tx.feed.update({
                    where: { id: feedId },
                    data: {
                        likeCount: { decrement: 1 }
                    },
                });
            }
        });
    }

    // 해당 유저가 특정 피드에 좋아요를 눌렀는지 확인
    async checkIfUserLiked(userId: string, feedId: string): Promise<boolean> {
        const like = await this.prisma.feedLike.findUnique({
            where: {
                userId_feedId: {
                    userId,
                    feedId,
                },
            }
        });

        // like 데이터가 있고(null이 아니고), 논리적 삭제(deletedAt)가 되지 않은 상태인지 확인
        return like !== null && like.deletedAt === null;
    }
}