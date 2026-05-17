import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../ports/in/login.usecase';
import { LoginCommand } from '../ports/in/login.command';
import type { VerifySocialTokenPort } from '../ports/out/verify-social-token.port';
import type { GenerateTokenPort } from '../ports/out/generate-token.port';
import type { GetOrCreateUserPort, AuthUserProfile } from '../ports/out/get-or-create-user.port';
import { VERIFY_SOCIAL_TOKEN_PORT } from '../ports/out/verify-social-token.port';
import { GENERATE_TOKEN_PORT } from '../ports/out/generate-token.port';
import { GET_OR_CREATE_USER_PORT } from '../ports/out/get-or-create-user.port';



@Injectable()
export class AuthService implements LoginUseCase {
    constructor(
        @Inject(VERIFY_SOCIAL_TOKEN_PORT)
        private readonly verifySocialTokenPort: VerifySocialTokenPort,

        @Inject(GENERATE_TOKEN_PORT)
        private readonly generateTokenPort: GenerateTokenPort,

        @Inject(GET_OR_CREATE_USER_PORT)
        private readonly getOrCreateUserPort: GetOrCreateUserPort,
    ) { }

    async login(command: LoginCommand): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthUserProfile;
        isNewUser: boolean;
    }> {
        // 소셜 토큰 검증
        const isValid = await this.verifySocialTokenPort.verify(
            command.provider,
            command.token,
        );

        // User 도메인에 유저 조회 또는 생성 요청 (DIP 활용)
        const { user, isNewUser } = await this.getOrCreateUserPort.getOrCreateUser(
            command.provider,
            command.providerId,
        )

        // JWT 발급
        const tokens = await this.generateTokenPort.generateTokens(user.id);

        return {
            ...tokens,
            user,
            isNewUser
        };
    }
}