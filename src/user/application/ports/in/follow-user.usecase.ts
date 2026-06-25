export const FOLLOW_USER_USECASE = Symbol('FOLLOW_USER_USECASE');

export class FollowUserCommand {
    constructor(
        public readonly followerId: string, // 팔로우를 거는 사람
        public readonly followingId: string, // 팔로우를 받을 사람
    ) { }
}

export interface FollowUserResult {
    isFollowing: boolean;
}

export interface FollowUserUseCase {
    /**
     * 특정 유저에 대한 팔로우 상태를 토글합니다.
     */
    toggleFollow(commnad: FollowUserCommand): Promise<FollowUserResult>;
}