import { DomainException } from "src/common/exceptions/domain.exception";

export class RoomClosedException extends DomainException {
    constructor() {
        super('이미 종료된 방입니다.')
    }
}

export class RoomFullException extends DomainException {
    constructor(max: number) {
        super(`방 정원(${max}명)이 초과되어 입장할 수 없습니다.`)
    }
}