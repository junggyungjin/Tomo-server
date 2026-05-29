export const MANAGE_REFRESH_TOKEN_PORT = Symbol('MANAGE_REFRESH_TOKEN_PORT');

export interface ManageRefreshTokenPort {
    /**
     * 발급된 Refresh Token을 DB에 저장
     * 다중 기기 지원을 위해 1명의 유저가 여러 개의 토큰을 가질 수 있음
     * @param userId 유저의 고유 식별자 (UUID)
     * @param token 발급된 Refresh Token 문자열
     * @param expiresAt 토큰 만료 시간
     * @param deviceInfo 기기 정보 (옵션)
     */
    saveRefreshToken(
        userId: string,
        token: string,
        expiresAt: Date,
        deviceInfo?: string,
    ): Promise<void>;

    /**
    * DB에 해당 Refresh Token이 존재하는지 검증하고 반환합니다.
    * @param token 검증할 Refresh Token 문자열
    * @returns 존재한다면 연관된 userId와 함께 반환, 존재하지 않거나 만료되었다면 null
    */
    findRefreshToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;

    /**
   * 특정 Refresh Token을 삭제합니다. (로그아웃 또는 만료된 토큰 갱신 시)
   * @param token 삭제할 Refresh Token 문자열
   */
    deleteRefreshToken(token: string): Promise<void>;

    /**
   * 특정 유저의 모든 Refresh Token을 삭제합니다. (모든 기기에서 로그아웃 시)
   * @param userId 유저의 고유 식별자 (UUID)
   */
    deleteAllRefreshTokens(userId: string): Promise<void>;
}