import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * 클라가 보낸 토큰을 검증
 */

// 페이로드의 타입을 정의합니다. (JwtAdapter에서 우리가 서명할 때 넣었던 데이터)
type JwtPayload = {
    sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // 요청 헤더에서 Bearer 토큰을 추출합니다.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 만료된 토큰은 자동으로 거부(401 Unauthorized)합니다.
            ignoreExpiration: false,
            // JwtAdapter 모듈 등록시 사용한 것과 동일한 secret 키를 사용합니다.
            secretOrKey: 'temporary-super-secret-key-for-tomo',
        });
    }

// 토큰의 서명이 유효하고 만료되지 않았다면 이 메서드가 실행됩니다.
// 이 메서드의 반환값은 Express의 Request 객체 안의 ``req.user``에 자동으로 담깁니다.
async validate(payload: JwtPayload) {
    // 지금은 단순히 토큰에 들어있던 유저 ID만 반환합니다.
    // (필요하다면 여기서 DB를 조회해 유저 상태를 확인할 수도 있습니다.)
    return { userId: payload.sub };
}

}