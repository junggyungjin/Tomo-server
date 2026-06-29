import { FeedComment } from "src/feed/domain/feed-comment.entity";

export const GET_FEED_COMMENTS_USE_CASE = Symbol('GET_FEED_COMMENTS_USE_CASE')

/**
 * 피드 최상위 댓글 목록 조회를 위한 Query 객체
 */
export class GetRootCommentsQuery {
    constructor(
        public readonly feedId: string,
        // 추후 확장을 위한 주석 (지금 당장 구현하지 않아도 구조는 열어둠)
        // public readonly cursor?: string, 
        // public readonly limit: number = 20,
    ) { }
}

/**
 * 특정 댓글의 대댓글 목록 조회를 위한 Query 객체
 */
export class GetRepliesQuery {
    constructor(
        public readonly feedId: string,
        public readonly parentCommentId: string,
    ) { }
}

/**
 * 피드 댓글 조회를 담당하는 인바운드 포트
 */
export interface GetFeedCommentsUseCase {
    /**
     * 피드의 최상위 댓글 목록을 조회
     * (각 댓글은 replyCount를 포함합니다)
     */
    getRootComments(query: GetRootCommentsQuery): Promise<FeedComment[]>;

    /**
     * 특정 댓글에 달린 대댓글 목록을 조회
     */
    getReplies(query: GetRepliesQuery): Promise<FeedComment[]>;
}