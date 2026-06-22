import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    /**
     * 기존 AuthGuard의 동작을 가로채서, 인증 실패 시 에러를 던지는 대신 유저 정보를 무시합니다.
     */
    handleRequest(err: any, user: any, info: any) {
        // err가 있거나, 토큰이 없어서 user가 false/null로 나오더라도 예외(Throw)를 발생시키지 않습니다.
        // 단순히 확인된 user 객체(있으면 유저 정보, 없으면 false/null)를 반환합니다.
        return user;
    }
}