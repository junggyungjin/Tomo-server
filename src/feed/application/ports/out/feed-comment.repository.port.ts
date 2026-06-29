import { FeedComment } from "src/feed/domain/feed-comment.entity";

export const FEED_COMMENT_REPOSITORY_PORT = Symbol('FEED_COMMENT_REPOSITORY_PORT');

export interface FeedCommentRepositoryPort {
    /**
     * 신규 댓글을 저장하거나, 기존 댓글의 변경 사항(수정, 삭제)를 업데이트
     */
    save(comment: FeedComment): Promise<FeedComment>;

    /**
     * 댓글 수정을 위한 권한 검증 및 상태 변경 전, 특정 댓글 1건을 조회
     */
    findById(id: string): Promise<FeedComment | null>;

    /**
     * 특정 피드에 달린 '최상위 댓글(부모가 없는 댓글)'목록을 조회
     */
    findRootCommentsByFeedId(feedId: string): Promise<FeedComment[]>;

    /**
     * 특정 댓글에 달린 '대댓글' 목록을 조회
     */
    findRepliesByParentId(parentId: string): Promise<FeedComment[]>;
}