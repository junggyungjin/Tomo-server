import { Inject, Injectable } from '@nestjs/common';
import { LoginUseCase } from '../ports/in/login.usecase';
import { LoginCommand } from '../ports/in/login.command';
import type { VerifySocialTokenPort } from '../ports/out/verify-social-token.port';
import type { GenerateTokenPort } from '../ports/out/generate-token.port';
import { VERIFY_SOCIAL_TOKEN_PORT } from '../ports/out/verify-social-token.port';
import { GENERATE_TOKEN_PORT } from '../ports/out/generate-token.port';


@Injectable()
export class AuthService implements LoginUseCase {
    constructor(
        @Inject('VERIFY_SOCIAL_TOKEN_PORT')
        private readonly verifySocialTokenPort: VerifySocialTokenPort,

        @Inject('GENERATE_TOKEN_PORT')
        private readonly generateTokenPort: GenerateTokenPort,
    ) { }

    async login(command: LoginCommand): Promise<{ accessToken: string; refreshToken: string; }> {
        const socialProfile = await this.verifySocialTokenPort.verify(command.token);

        // TODO: Day 13에 User 도메인과 연동하여 DB에 유저가 없으면 회원가입 시키는 로직 추가 예정
        // const user = await this.getUserPort.findBySocialId(socialProfile.socialId);
        // if(!user) { ... }

        const tokens = await this.generateTokenPort.generateTokens(socialProfile.providerId);

        return tokens;
    }
}