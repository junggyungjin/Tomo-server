import { ApiProperty } from "@nestjs/swagger";

export class ApiError {
    @ApiProperty({ description: '비즈니스 에러 코드', example: 'USER_NOT_FOUND' })
    code: string;

    @ApiProperty({ description: '에러 상세 메시지', example: '사용자를 찾을 수 없습니다.' })
    message: string;

    @ApiProperty({ description: '유효성 검사 실패 등 상세 에러 내역', required: false })
    details?: any[];

    constructor(code: string, message: string, details?: any[]) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}

export class ApiResponse<T> {
    // 성공 여부를 명확히 나타내는 boolean 플래그
    @ApiProperty({ description: 'API 요청 성공 여부', example: true })
    success: boolean;

    // 응답이 발생한 시간 (디버깅 및 클라이언트 동기화용)
    @ApiProperty({ description: '응답 발생 시간', example: '2026-05-25T10:00:00.000Z' })
    timestamp: string;

    // 성공 시 전달할 실제 데이터 (에러일 경우 null 또는 생략)
    // 제네릭 데이터는 개별 컨트롤러에서 ApiOkResponse의 type 옵션 등을 통해 명시
    @ApiProperty({ description: '실제 응답 데이터 (성공 시 반환)', required: false })
    data?: T;

    // 에러 발생 시 상세 정보 (성공일 경우 null 또는 생략)
    @ApiProperty({ description: '에러 정보 (실패 시 반환)', type: () => ApiError, required: false })
    error?: ApiError;

    private constructor(success: boolean, data?: T, error?: ApiError) {
        this.success = success;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.error = error;
    }

    // 성공 응답을 생성하는 팩토리 메서드
    static OK<T>(data: T): ApiResponse<T> {
        return new ApiResponse<T>(true, data);
    }

    // 에러 응답을 생성하는 팩토리 메서드
    static ERROR(error: ApiError): ApiResponse<any> {
        return new ApiResponse<any>(false, undefined, error);
    }
}