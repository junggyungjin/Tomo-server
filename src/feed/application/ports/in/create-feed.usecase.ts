import { Feed } from "src/feed/domain/feed.entity";

export class CreateFeedCommand {
    constructor(
        public readonly authorId: string,
        public readonly content: string | null,
        public readonly hasCallRoom: boolean,
    ) { }
}

export const CREATE_FEED_USE_CASE = Symbol('CREATE_FEED_USE_CASE');

export interface CreateFeedUseCase {
    execute(command: CreateFeedCommand): Promise<Feed>;
}