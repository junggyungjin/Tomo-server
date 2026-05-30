import { CallRoom } from "./call-room.entity";

export class Feed {
    constructor(
        public readonly id: string,
        public content: string | null,
        public readonly authorId: string,
        public callRoom: CallRoom | null,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) { }

    // 팩토리 메서드 : 서비스 계층에서 새로운 피드를 생성할때 사용
    static create(payload: {
        id: string;
        content: string | null;
        authorId: string;
        callRoom: CallRoom | null;
    }): Feed {
        const now = new Date();
        return new Feed(
            payload.id,
            payload.content,
            payload.authorId,
            payload.callRoom,
            now,
            now,
        );
    }
}