import type { AuthUserProfile } from "../out/get-or-create-user.port";

export const DEV_LOGIN_USECASE = Symbol('DEV_LOGIN_USECASE')

export class DevLoginCommand {
    constructor(
        public readonly providerId: string,
    ) { }
}

export interface DevLoginUseCase {
    devLogin(command: DevLoginCommand): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthUserProfile;
        isNewUser: boolean;
    }>;
}