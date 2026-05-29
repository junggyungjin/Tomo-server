import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenPort } from 'src/auth/application/ports/out/generate-token.port';

/**
 * 토큰을 실제로 발급하는 어댑터
 */
@Injectable()
export class JwtAdapter implements GenerateTokenPort {
    constructor(private readonly jwtService: JwtService) { }

    async generateTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    }> {
        const payload = { sub: userId };

        // Access, Refresh 토큰 병렬 생성
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '1h' }), // Access Token: 1시간
            this.jwtService.signAsync(payload, { expiresIn: '14d' }), // Refresh Token: 14일
        ]);

        // Refresh Token 만료 시간(Date 객체) 계산 로직 (현재 시점 + 14일)
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 14);

        return { accessToken, refreshToken, refreshTokenExpiresAt };
    }
}