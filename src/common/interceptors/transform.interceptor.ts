import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {

    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const { method, url, body } = request;

        const maskedBody = this.maskSensitiveData(body);
        this.logger.log(`[Request] ${method} ${url}\nBody: ${JSON.stringify(maskedBody, null, 2)}`);

        const now = Date.now();

        return next.handle().pipe(
            map((data) => {
                // 이미 ApiResponse 형태로 감싸진 경우 중복 Wrapping 방지
                let response = data instanceof ApiResponse ? data : ApiResponse.OK(data);

                const maskedData = this.maskSensitiveData(response.data);
                const delay = Date.now() - now;

                this.logger.log(`[Response] ${method} ${url} - ${delay}ms\nData: ${JSON.stringify(maskedData, null, 2)}`);

                // 반환된 데이터를 ApiResponse.OK()를 사용해 공통 포맷으로 감싸서 리턴
                return response;
            })
        )
    }

    /**
     * 민감하거나 너무 긴 데이터를 필터링/마스킹하는 헬퍼 함수
     * @param data 
     */
    private maskSensitiveData(data: any): any {
        if (!data || typeof data !== 'object') return data;

        // 원본 데이터를 훼손하지 않기 위해 얕은 복사(Shallow Copy)
        const masked = { ...data };

        // 🚨 토큰이나 비밀번호 등 너무 길거나 민감한 값은 요약 처리
        const keysToMask = ['token', 'accessToken', 'refreshToken', 'password'];

        for (const key of Object.keys(masked)) {
            if (keysToMask.includes(key) && typeof masked[key] === 'string') {
                const val = masked[key];
                // 앞 15자리 정도만 보여주고 나머지는 ... 처리
                masked[key] = val.length > 20 ? `${val.substring(0, 15)}...[TRUNCATED]` : '***';
            }

            // 객체 안에 또 객체가 있다면 재귀적으로 처리 (필요시 활성화)
            // if (typeof masked[key] === 'object') {
            //     masked[key] = this.maskSensitiveData(masked[key]);
            // }
        }

        return masked;
    }
}