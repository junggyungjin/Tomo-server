import { RoomClosedException, RoomFullException } from "./exceptions/call-room.exceptions";

export enum RoomStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export class CallRoom {
    constructor(
        public readonly id: string | null,
        public readonly feedId: string | null,
        public status: RoomStatus,
        public readonly maxParticipants: number,
        public currentParticipants: number,
        public readonly createdAt: Date,
    ) { }

    // 팩토리 메서드
    static create(payload: { maxParticipants: number }): CallRoom {
        return new CallRoom(
            null,
            null,
            RoomStatus.OPEN,
            payload.maxParticipants,
            1,
            new Date()
        );
    }

    // 방 닫기
    closeRoom() {
        this.status = RoomStatus.CLOSED;
    }

    // 유저 입장 로직
    joinUser(): void {
        if (this.status === RoomStatus.CLOSED) {
            // 종료된 통화방
            throw new RoomClosedException();
        }
        if (this.currentParticipants >= this.maxParticipants) {
            // 방 정원 초과 
            throw new RoomFullException(this.maxParticipants);
        }
        this.currentParticipants += 1;
    }

    // 유저 퇴장 로직
    leaveUser(): void {
        if (this.currentParticipants > 0) {
            this.currentParticipants -= 1;
        }
        // 만앿 인원이 0명이 되면 방을 자동으로 닫음
        if (this.currentParticipants === 0) {
            this.closeRoom();
        }
    }
}