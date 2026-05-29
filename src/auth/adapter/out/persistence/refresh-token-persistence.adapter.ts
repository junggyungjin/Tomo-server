import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageRefreshTokenPort } from "src/auth/application/ports/out/manage-refresh-token.port";

@Injectable()
export class RefreshTokenPersistenceAdapter implements ManageRefreshTokenPort {
    constructor(private readonly prisma: PrismaService) { }

    async saveRefreshToken(
        userId: string,
        token: string,
        expiresAt: Date,
        deviceInfo?: string
    ): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt,
                deviceInfo,
            },
        });
    }

    async findRefreshToken(
        token: string
    ): Promise<{ userId: string; expiresAt: Date; } | null> {
        const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token },
            select: { userId: true, expiresAt: true },
        });
        return refreshTokenRecord;
    }

    async deleteRefreshToken(token: string): Promise<void> {
        // 삭제할 토큰이 없을 때 에러가 나지 않도록 deleteMany 사용
        await this.prisma.refreshToken.deleteMany({
            where: { token },
        });
    }

    async deleteAllRefreshTokens(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
}