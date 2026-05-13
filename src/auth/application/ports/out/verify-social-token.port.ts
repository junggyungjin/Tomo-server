export const VERIFY_SOCIAL_TOKEN_PORT = Symbol('VERIFY_SOCIAL_TOKEN_PORT');


/**
 * 소셜 토큰 검증 결과로 반환할 유저 정보
 */
export interface SocialProfile {
    providerId: string;
    email?: string;
    name?: string;
}

export interface VerifySocialTokenPort {
    /**
   * 제공된 소셜 토큰을 외부 서비스(Google, Apple 등)를 통해 검증하고,
   * 프로필 정보를 추출하여 반환합니다.
   * 
   * @param token 클라이언트에서 전달받은 idToken 또는 accessToken
   * @throws 검증 실패 시 예외를 던집니다.
   */
    verify(token: string): Promise<SocialProfile>;
}