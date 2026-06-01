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

        let savedPrismaFeed;

        // ID가 없으면 새로운 피드이므로 DB에 새로 생성(Create)
        if (!persistenceData.id) {
            savedPrismaFeed = await this.prisma.feed.create({
                data: {
                    // ID는 Prisma(PostgreSQL)가 알아서 uuid로 생성
                    authorId: persistenceData.authorId,
                    content: persistenceData.content,

                    // Mapper에서 넘어온 callRoom 데이터가 있다면 Nested Create로 한 번에 저장
                    ...(persistenceData.callRoom && {
                        callRoom: {
                            create: {
                                maxParticipants: persistenceData.callRoom.maxParticipants,
                                currentParticipants: persistenceData.callRoom.currentParticipants,
                                status: persistenceData.callRoom.status,
                            },
                        },
                    }),
                },
                include: {
                    callRoom: true, // 생성 후 통화방 데이터까지 묶어서 반환받음
                },
            });
        }
        // ID가 있으면 기존 피드 수정이므로 업데이트(Update)
        else {
            savedPrismaFeed = await this.prisma.feed.update({
                where: { id: persistenceData.id },
                data: {
                    content: persistenceData.content,
                    // 통화방 인원 변동 등 추가 업데이트가 필요하다면 여기에 로직 추가
                },
                include: {
                    callRoom: true,
                },
            });
        }

        // DB 저장이 끝난 데이터를 다시 순수 도메인 객체로 넘겨 줌
        return FeedMapper.toDomain(savedPrismaFeed);
    }

    async findById(id: string): Promise<Feed | null> {
        const prismaFeed = await this.prisma.feed.findUnique({
            where: { id },
            include: { callRoom: true },
        });

        if (!prismaFeed) return null;

        return FeedMapper.toDomain(prismaFeed);
    }

    async findAll(): Promise<Feed[]> {
        const prismaFeeds = await this.prisma.feed.findMany({
            orderBy: { createdAt: 'desc' }, // 보통 피드는 최신순(내림차순)으로 정렬
            include: { callRoom: true },
        });

        return prismaFeeds.map(prismaFeed => FeedMapper.toDomain(prismaFeed));
    }
}