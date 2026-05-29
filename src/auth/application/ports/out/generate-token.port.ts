export const GENERATE_TOKEN_PORT = Symbol('GENERATE_TOKEN_PORT');

export interface GenerateTokenPort {
    /**
   * 유저의 식별자를 받아 Access Token과 Refresh Token을 발급합니다.
   * 구체적인 기술(예: JWT)은 이 인터페이스를 구현하는 어댑터에서 담당합니다.
   */
    generateTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    }>;
}