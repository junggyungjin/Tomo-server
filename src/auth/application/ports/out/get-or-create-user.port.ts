export const GET_OR_CREATE_USER_PORT = 'GET_OR_CREATE_USER_PORT';

export interface GetOrCreateUserPort {
    /*
     * 소셜 로그인 정보를 바탕으로 유저를 가져오거나, 없으면 새로 생성하여 반환합니다.
     * Auth 도메인은 유저의 세부 정보보다 JWT 페이로드에 넣을 최소한의 정보(id 등)만 필요로 합니다.
     */
    getOrCreateUser(
        provider: string,
        providerId: string,
    ): Promise<{
        user: AuthUserProfile;
        isNewUser: boolean;
    }>; // 향후 권한(role) 등이 필요하면 여기에 추가
}

export interface AuthUserProfile {
    id: string;
    handle: string;
    status: string;
}