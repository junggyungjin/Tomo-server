import { Injectable, Inject } from "@nestjs/common";
import { DevLoginUseCase, DevLoginCommand } from "../ports/in/dev-login.usecase";
import type { GenerateTokenPort } from "../ports/out/generate-token.port";
import type { GetOrCreateUserPort, AuthUserProfile } from "../ports/out/get-or-create-user.port";
import type { ManageRefreshTokenPort } from "../ports/out/manage-refresh-token.port";
import { GENERATE_TOKEN_PORT } from "../ports/out/generate-token.port";
import { GET_OR_CREATE_USER_PORT } from "../ports/out/get-or-create-user.port";
import { MANAGE_REFRESH_TOKEN_PORT } from "../ports/out/manage-refresh-token.port";

@Injectable()
export class DevLoginService implements DevLoginUseCase {
    constructor(
        @Inject(GET_OR_CREATE_USER_PORT)
        private readonly getOrCreateUserPort: GetOrCreateUserPort,

        @Inject(GENERATE_TOKEN_PORT)
        private readonly generateTokenPort: GenerateTokenPort,

        @Inject(MANAGE_REFRESH_TOKEN_PORT)
        private readonly manageRefreshTokenPort: ManageRefreshTokenPort,
    ) { }

    async devLogin(commnad: DevLoginCommand): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthUserProfile;
        isNewUser: boolean;
    }> {
        const { user, isNewUser } = await
            this.getOrCreateUserPort.getOrCreateUser(
                'dev',
                commnad.providerId,
            );

        // JWT 발급
        const { accessToken, refreshToken, refreshTokenExpiresAt } = await this.generateTokenPort.generateTokens(user.id);
        // 리프레시 토큰 DB 저장
        await this.manageRefreshTokenPort.saveRefreshToken(
            user.id,
            refreshToken,
            refreshTokenExpiresAt
        );

        return {
            accessToken,
            refreshToken,
            user,
            isNewUser
        };
    }
}