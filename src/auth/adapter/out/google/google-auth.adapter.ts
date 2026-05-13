import { Injectable, UnauthorizedException } from "@nestjs/common";
import { OAuth2Client } from 'google-auth-library';
import { VerifySocialTokenPort, SocialProfile } from "src/auth/application/ports/out/verify-social-token.port";

@Injectable()
export class GoogleAuthAdapter implements VerifySocialTokenPort {
    private readonly client: OAuth2Client;

    private readonly clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    constructor() {
        this.client = new OAuth2Client(this.clientId);
    }

    async verify(token: string): Promise<SocialProfile> {
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
            throw new UnauthorizedException('유효하지 않은 구글 토큰입니다.');
        }
    }
}

