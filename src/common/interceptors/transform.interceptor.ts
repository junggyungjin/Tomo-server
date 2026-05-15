import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
        return next.handle().pipe(
            map((data) => {
                // 이미 ApiResponse 형태로 감싸진 경우 중복 Wrapping 방지
                if (data instanceof ApiResponse) {
                    return data;
                }

                // 반환된 데이터를 ApiResponse.OK()를 사용해 공통 포맷으로 감싸서 리턴
                return ApiResponse.OK(data);
            })
        )
    }
}