import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse, ApiError } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const Request = ctx.getRequest<Request>();

        // 상태 코드 결정
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorCode = 'INTERNAL_SERVER_ERROR';
        let errorMessage = 'An unexpected error occurred';
        let errorDetails: any[] | undefined = undefined;

        // NestJS의 기본 HttpException (ValidationPipe 등) 처리
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse() as any;
            errorCode = exceptionResponse.error || HttpStatus[status];
            errorMessage = typeof exceptionResponse === 'string'
                ? exceptionResponse : (exceptionResponse.message || 'Error occureed');

            // ValidationPipe에서 배열 형태로 메시지가 넘어올 경우 처리
            if (Array.isArray(exceptionResponse.message)) {
                errorMessage = 'Validation failed';
                errorDetails = exceptionResponse.message;
            }
        } else if (exception instanceof Error) {
            // 일반 Error 객체인 경우 (런타임 에러)
            errorMessage = exception.message;
        }

        // 서버 로깅
        this.logger.error(
            `[${`request.method`}] ${`request.url`} - Status: ${status} - Message: ${errorMessage}`,
            exception instanceof Error ? exception.stack : '',
        );

        // 공통 에러 응답 포맷 생성
        const apiError = new ApiError(errorCode, errorMessage, errorDetails);
        const responseBody = ApiResponse.ERROR(apiError);

        response.status(status).json(responseBody);

    }
}