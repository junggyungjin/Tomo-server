import { Feed } from "src/feed/domain/feed.entity";

export const GET_FEED_USE_CASE = Symbol('GET_FEED_USE_CASE');

export interface GetFeedUseCase {
    getFeeds(): Promise<Feed[]>;
    getFeedById(feedId: string): Promise<Feed | null>;
}