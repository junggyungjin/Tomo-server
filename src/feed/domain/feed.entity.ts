import { CallRoom } from "./call-room.entity";

export class Feed {
    constructor(
        public readonly id: string | null,
        public content: string | null,
        public readonly authorId: string,
        public callRoom: CallRoom | null,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) { }

    // 팩토리 메서드 : 서비스 계층에서 새로운 피드를 생성할때 사용
    static create(payload: {
        content: string | null;
        authorId: string;
        callRoom: CallRoom | null;
    }): Feed {
        const now = new Date();
        return new Feed(
            null,
            payload.content,
            payload.authorId,
            payload.callRoom,
            now,
            now,
        );
    }

    static restore(payload: {
        id: string;
        content: string | null;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        callRoom: CallRoom | null;
    }): Feed {
        return new Feed(
            payload.id,
            payload.content,
            payload.authorId,
            payload.callRoom,
            payload.createdAt,
            payload.updatedAt
        );
    }

    updateContent(newContent: string): void {
        this.content = newContent;
        this.updatedAt = new Date();
    }
}