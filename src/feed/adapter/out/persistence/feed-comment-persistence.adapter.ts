import { Injectable } from "@nestjs/common";
import { FeedCommentRepositoryPort } from "src/feed/application/ports/out/feed-comment.repository.port";
import { FeedComment } from "src/feed/domain/feed-comment.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { FeedCommentMapper } from "./mapper/feed-comment.mapper";

@Injectable()
export class FeedCommentPersistenceAdapter implements FeedCommentRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(comment: FeedComment): Promise<FeedComment> {
        const persistenceData = FeedCommentMapper.toPersistence(comment);

        if (!persistenceData.id) {
            //1. 신규 댓글 생성 로직 (생성 + 카운트 증가)
            const [savedPrismaComment] = await this.prisma.$transaction([
                this.prisma.feedComment.create({
                    data: {
                        feedId: persistenceData.feedId,
                        authorId: persistenceData.authorId,
                        content: persistenceData.content,
                        parentId: persistenceData.parentId,
                    },
                    include: {
                        author: { select: { handle: true, nickname: true } },
                        _count: { select: { replies: { where: { deletedAt: null } } } },
                    }
                }),
                this.prisma.feed.update({
                    where: { id: persistenceData.feedId },
                    data: { commentCount: { increment: 1 } }
                })
            ]);
            return FeedCommentMapper.toDomain(savedPrismaComment);
        } else {
            // 2. 기존 댓글 업데이트 로직
            if (persistenceData.deletedAt) {
                // 2-A. Soft Delete인 경우 (업데이트 + 카운트 감소 트랜잭션)
                const [savedPrismaComment] = await this.prisma.$transaction([
                    this.prisma.feedComment.update({
                        where: { id: persistenceData.id },
                        data: {
                            content: persistenceData.content,
                            deletedAt: persistenceData.deletedAt,
                        },
                        include: {
                            author: { select: { handle: true, nickname: true } },
                            _count: { select: { replies: { where: { deletedAt: null } } } },
                        }
                    }),
                    this.prisma.feed.update({
                        where: { id: persistenceData.feedId },
                        data: { commentCount: { decrement: 1 } }
                    })
                ]);
                return FeedCommentMapper.toDomain(savedPrismaComment);
            } else {
                // 2-B. 단순 텍스트 수정인 경우 (단일 업데이트)
                const savedPrismaComment = await this.prisma.feedComment.update({
                    where: { id: persistenceData.id },
                    data: { content: persistenceData.content },
                    include: {
                        author: { select: { handle: true, nickname: true } },
                        _count: { select: { replies: { where: { deletedAt: null } } } },
                    }
                });
                return FeedCommentMapper.toDomain(savedPrismaComment);
            }
        }
    }

    async findById(id: string): Promise<FeedComment | null> {
        const comment = await this.prisma.feedComment.findUnique({
            where: { id },
            include: {
                author: { select: { handle: true, nickname: true } },
                _count: { select: { replies: { where: { deletedAt: null } } } },
            }
        });

        return comment ? FeedCommentMapper.toDomain(comment) : null;
    }

    async findRootCommentsByFeedId(feedId: string): Promise<FeedComment[]> {
        const comments = await this.prisma.feedComment.findMany({
            where: {
                feedId,
                parentId: null,
            },
            orderBy: { createdAt: 'asc' },
            include: {
                author: { select: { handle: true, nickname: true } },
                _count: { select: { replies: { where: { deletedAt: null } } } },
            }
        });

        return comments.map(c => FeedCommentMapper.toDomain(c));
    }

    async findRepliesByParentId(parentId: string): Promise<FeedComment[]> {
        const replies = await this.prisma.feedComment.findMany({
            where: { parentId },
            orderBy: { createdAt: 'asc' },
            include: {
                author: { select: { handle: true, nickname: true } },
                _count: { select: { replies: { where: { deletedAt: null } } } },
            }
        });

        return replies.map(r => FeedCommentMapper.toDomain(r));
    }
}