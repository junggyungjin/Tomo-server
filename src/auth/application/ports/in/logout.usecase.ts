export const LOGOUT_USECASE = Symbol('LOGOUT_USECASE');

export class LogoutCommand {
    constructor(
        public readonly userId: string,
        public readonly refreshToken: string,
    ) { }
}

export interface LogoutUseCase {
    /**
     * 로그아웃 처리
     */
    logout(commnad: LogoutCommand): Promise<void>;
}