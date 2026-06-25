export const FOLLOW_REPOSITORY_PORT = Symbol('FOLLOW_REPOSITORY_PORT')

export interface FollowRepositoryPort {
    /**
     * 두 유저 간의 팔로우 관계가 존재하는지 확인합니다.
     * @param followerId 팔로우를 건 유저 (나)
     * @param followingId 팔로우 대상 유저 (상대방)
     * @returns 팔로우 중이면 true, 아니면 false
     */
    isFollowing(followerId: string, followingId: string): Promise<boolean>;

    /**
     * 팔로우 상태를 토글(팔로우/언팔로우)합니다.
     * @param followerId 팔로우를 건 유저 (나)
     * @param followingId 팔로우 대상 유저 (상대방)
     * @returns 처리 후의 최종 팔로우 상태 (true: 팔로우 됨, false: 언팔로우 됨)
     */
    toggleFollow(followerId: string, followingId: string): Promise<boolean>;

    /**
     * 특정 유저의 팔로워 수와 팔로잉 수를 반환합니다.
     * @param userId 조회할 유저 ID
     */
    getFollowCounts(userId: string): Promise<{ followerCount: number; followingCount: number }>;
}