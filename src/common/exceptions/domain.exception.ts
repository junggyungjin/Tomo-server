export abstract class DomainException extends Error {
    protected constructor(message: string) {
        super(message);
        this.name = this.constructor.name; // 에러 이름이 클래스 이름이 되도록 자동 설정
    }
}