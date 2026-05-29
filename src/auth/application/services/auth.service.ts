import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../ports/in/login.usecase';
import { LoginCommand } from '../ports/in/login.command';
import type { VerifySocialTokenPort } from '../ports/out/verify-social-token.port';
import type { GenerateTokenPort } from '../ports/out/generate-token.port';
import type { GetOrCreateUserPort, AuthUserProfile } from '../ports/out/get-or-create-user.port';
import type { ManageRefreshTokenPort } from '../ports/out/manage-refresh-token.port';
import { VERIFY_SOCIAL_TOKEN_PORT } from '../ports/out/verify-social-token.port';
import { GENERATE_TOKEN_PORT } from '../ports/out/generate-token.port';
import { GET_OR_CREATE_USER_PORT } from '../ports/out/get-or-create-user.port';
import { MANAGE_REFRESH_TOKEN_PORT } from '../ports/out/manage-refresh-token.port';
import { RefreshTokenCommand, RefreshTokenUseCase } from '../ports/in/refresh-token.usecase';

@Injectable()
export class AuthService implements LoginUseCase, RefreshTokenUseCase {
    constructor(
        @Inject(VERIFY_SOCIAL_TOKEN_PORT)
        private readonly verifySocialTokenPort: VerifySocialTokenPort,

        @Inject(GENERATE_TOKEN_PORT)
        private readonly generateTokenPort: GenerateTokenPort,

        @Inject(GET_OR_CREATE_USER_PORT)
        private readonly getOrCreateUserPort: GetOrCreateUserPort,

        @Inject(MANAGE_REFRESH_TOKEN_PORT)
        private readonly manageRefreshTokenPort: ManageRefreshTokenPort,
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

        if (!isValid) {
            throw new UnauthorizedException('유효하지 않은 소셜 토큰입니다.')
        }

        // User 도메인에 유저 조회 또는 생성 요청 (DIP 활용)
        const { user, isNewUser } = await this.getOrCreateUserPort.getOrCreateUser(
            command.provider,
            command.providerId,
        )

        // 영구 정지 유저 로그인 차단 방어 로직
        if (user.status === 'BANNED') {
            throw new ForbiddenException('영구 정지된 계정입니다.');
        }

        // JWT 발급
        const { accessToken, refreshToken, refreshTokenExpiresAt } = await this.generateTokenPort.generateTokens(user.id);

        // 발급된 refresh token을 db에 저장
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

    // 토큰 갱신 메서드 구현
    async refresh(command: RefreshTokenCommand): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        // 1. DB에서 리프레시 토큰 유효성 검증
        const tokenRecord = await this.manageRefreshTokenPort.findRefreshToken(command.refreshToken);

        if (!tokenRecord) {
            throw new UnauthorizedException('유효하지 않거나 만료된 리프레시 토큰입니다');
        }

        // 2. 보안(RTR)을 위해 한 번 사용된 리프레시 토큰은 삭제
        await this.manageRefreshTokenPort.deleteRefreshToken(command.refreshToken);

        // 3. 새로운 토큰 쌍 발급
        const {
            accessToken,
            refreshToken,
            refreshTokenExpiresAt
        } = await this.generateTokenPort.generateTokens(tokenRecord.userId)

        // 4. 새로운 리프레시 토큰 DB 저장
        await this.manageRefreshTokenPort.saveRefreshToken(
            tokenRecord.userId,
            refreshToken,
            refreshTokenExpiresAt
        );

        return { accessToken, refreshToken }
    }
}