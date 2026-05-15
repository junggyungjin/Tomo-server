export class ApiResponse<T> {
    // 성공 여부를 명확히 나타내는 boolean 플래그
    success: boolean;

    // 응답이 발생한 시간 (디버깅 및 클라이언트 동기화용)
    timestamp: string;

    // 성공 시 전달할 실제 데이터 (에러일 경우 null 또는 생략)
    data?: T;

    // 에러 발생 시 상세 정보 (성공일 경우 null 또는 생략)
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

export class ApiError {
    // 클라이언트가 분기 처리를 할 수 있는 비즈니스 에러 코드 (예, 'USER_NOT_FOUND', 'INVALID_TOKEN')
    code: string;

    // 개발자나 사용자가 읽을 수 있는 상세 메시지
    message: string;

    // 유효성 검사 실패 시 필드별 상세 에러 내역 등을 담는 배열 (선택적)
    details?: any[];

    constructor(code: string, message: string, details?: any[]) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}