import { Feed } from "src/feed/domain/feed.entity";

export const FEED_REPOSITORY_PORT = Symbol('FEED_REPOSITORY_PORT');

export interface FeedRepositoryPort {
    save(feed: Feed): Promise<Feed>;
    findById(id: string): Promise<Feed | null>;
    findAll(): Promise<Feed[]>;
    toggleLike(userId: string, feedId: string, isLike: boolean): Promise<void>;
    checkIfUserLiked(userId: string, feedId: string): Promise<boolean>
}