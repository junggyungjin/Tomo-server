export const REFRESH_TOKEN_USECASE = Symbol('REFRESH_TOKEN_USECASE')

export class RefreshTokenCommand {
    constructor(
        public readonly refreshToken: string,
    ) { }
}

export interface RefreshTokenUseCase {
    /**
     * 기존의 Refresh Token을 검증하고 새로운 Access/Refresh 토큰 쌍을 발급
     * 보안을 위해 Refresh Token Rotation (RTR) 방식을 적용하여 기존 토큰은 삭제/무효화
     */
    refresh(command: RefreshTokenCommand): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}