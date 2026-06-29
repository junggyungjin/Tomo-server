import { FeedComment as PrismaFeedComment, User } from "@prisma/client";
import { FeedComment } from "src/feed/domain/feed-comment.entity";

type PrismaFeedCommentWithAuthorAndReplies = PrismaFeedComment & {
    author: Pick<User, 'handle' | 'nickname'>;
    _count?: {
        replies: number;
    };
};

export class FeedCommentMapper {
    static toDomain(prismaComment: PrismaFeedCommentWithAuthorAndReplies): FeedComment {
        return FeedComment.from({
            id: prismaComment.id,
            feedId: prismaComment.feedId,
            authorId: prismaComment.authorId,
            authorHandle: prismaComment.author.handle,
            content: prismaComment.content,
            createdAt: prismaComment.createdAt,
            updatedAt: prismaComment.updatedAt,
            authorNickname: prismaComment.author.nickname,
            parentId: prismaComment.parentId,
            deletedAt: prismaComment.deletedAt,
            replyCount: prismaComment._count?.replies ?? 0,
        });
    }

    static toPersistence(domainComment: FeedComment): Omit<PrismaFeedComment, 'id'> & { id?: string } {
        return {
            id: domainComment.id || undefined,
            feedId: domainComment.feedId,
            authorId: domainComment.authorId,
            content: domainComment.content,
            parentId: domainComment.parentId,
            createdAt: domainComment.createdAt,
            updatedAt: domainComment.updatedAt,
            deletedAt: domainComment.deletedAt,
        }
    }
}