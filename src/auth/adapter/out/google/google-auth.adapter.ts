import { Injectable, UnauthorizedException } from "@nestjs/common";
import { OAuth2Client } from 'google-auth-library';
import { VerifySocialTokenPort, SocialProfile } from "src/auth/application/ports/out/verify-social-token.port";

@Injectable()
export class GoogleAuthAdapter implements VerifySocialTokenPort {
    private readonly client: OAuth2Client;

    private readonly clientId = '831538870114-nam04ognooopgklj36fspsgak85mt7ur.apps.googleusercontent.com';

    constructor() {
        this.client = new OAuth2Client(this.clientId);
    }

    async verify(provider: string, token: string): Promise<SocialProfile> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: this.clientId,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                throw new UnauthorizedException('구글 토큰 페이로드가 비어있습니다.')
            }

            return {
                providerId: payload.sub,
                email: payload.email,
                name: payload.name
            }
        } catch (error) {
            // 디버깅을 위해 원래의 에러 메시지를 로그로 남겨두면 좋습니다.
            console.error('Google Token Verify Error:', (error as Error).message);
            throw new UnauthorizedException('유효하지 않은 구글 토큰입니다.');
        }
    }
}

