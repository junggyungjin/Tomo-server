export const LIKE_FEED_USE_CASE = Symbol('LIKE_FEED_USE_CASE');

export class LikeFeedCommand {
    constructor(
        public readonly userId: string,
        public readonly feedId: string,
    ) { }
}

// 2. 프론트엔드에 내려줄 명확한 반환 타입
export interface LikeFeedResult {
    isLiked: boolean;
    likeCount: number;
}

export interface LikeFeedUseCase {
    /**
    * 피드에 좋아요를 토글(추가/취소)합니다.
    * @param command userId와 feedId를 포함하는 명령 객체
    * @returns 처리 후의 최종 좋아요 상태와 갱신된 좋아요 개수
    */
    execute(command: LikeFeedCommand): Promise<LikeFeedResult>;
}