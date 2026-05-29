import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// 현재 로그인한 유저 정보를 Request에서 깔끔하게 추출하는 커스텀 데코레이터
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // JwtStrategy의 validate() 메서드에서 반환한 객체 { userId: '...' }가 req.user에 들어있음
        return request.user;
    }
)