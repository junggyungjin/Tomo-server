import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { LogoutUseCase, LogoutCommand } from "../ports/in/logout.usecase";
import type { ManageRefreshTokenPort } from "../ports/out/manage-refresh-token.port";
import { MANAGE_REFRESH_TOKEN_PORT } from "../ports/out/manage-refresh-token.port";

@Injectable()
export class LogoutService implements LogoutUseCase {
    constructor(
        @Inject(MANAGE_REFRESH_TOKEN_PORT)
        private readonly manageRefreshTokenPort: ManageRefreshTokenPort,
    ) { }

    async logout(command: LogoutCommand): Promise<void> {
        // 클라이언트가 보낸 리프레시 토큰이 DB에 실제 존재하는지 조회
        const tokenRecord = await this.manageRefreshTokenPort.findRefreshToken(command.refreshToken);

        // 토큰이 아예 존재하지 않는다면 에러
        if (!tokenRecord) {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
        }

        // 토큰의 진짜 주인과 현재 로그아웃을 요청한 사람 비교
        if (tokenRecord.userId !== command.userId) {
            throw new UnauthorizedException('본인의 기기만 로그아웃할 수 있습니다.')
        }

        // DB에서 삭제 처리
        await this.manageRefreshTokenPort.deleteRefreshToken(command.refreshToken);
    }

}