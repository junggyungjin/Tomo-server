import { LoginCommand } from "./login.comman";

export const LOGIN_USECASE = Symbol('LOGIN_USECASE');

export interface LoginUseCase {
    /**
   * 소셜 로그인 정보를 바탕으로 유저를 찾거나 새로 생성(Upsert)한 뒤,
   * 자체 JWT 토큰(혹은 인증 세션 정보)을 반환합니다.
   */
    login(command: LoginCommand): Promise<{ accessToken: string; refreshToken: string }>;
}