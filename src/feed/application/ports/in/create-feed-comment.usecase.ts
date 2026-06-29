import { FeedComment } from "src/feed/domain/feed-comment.entity";

export const CREATE_FEED_COMMENT_USE_CASE = Symbol('CREATE_FEED_COMMENT_USE_CASE');

export class CreateFeedCommentCommand {
    constructor(
        public readonly feedId: string,
        public readonly authorId: string,
        public readonly authorNickname: string | null,
        public readonly authorHandle: string,
        public readonly content: string,
        public readonly parentId?: string | null,

    ) { }
}

export interface CreateFeedCommentUseCase {
    execute(command: CreateFeedCommentCommand): Promise<FeedComment>;
}
