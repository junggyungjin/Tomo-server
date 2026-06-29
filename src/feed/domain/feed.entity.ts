import { CallRoom } from "./call-room.entity";

export class Feed {
    // 1. 캡슐화: private 속성으로 변경하여 외부의 임의 조작 방지
    private constructor(
        private readonly _id: string | null,
        private _content: string | null,
        private readonly _authorId: string,
        private readonly _authorNickname: string,
        private readonly _authorHandle: string,
        private _callRoom: CallRoom | null,
        private _likeCount: number,
        private _commentCount: number,
        private readonly _isLiked: boolean = false,
        private readonly _isAuthorFollowing: boolean = false,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
        private _deletedAt: Date | null,
    ) { }

    // 2. 외부 조회를 위한 Getters
    get id(): string | null { return this._id; }
    get content(): string | null { return this._content; }
    get authorId(): string { return this._authorId; }
    get authorNickname(): string { return this._authorNickname; }
    get authorHandle(): string { return this._authorHandle; }
    get callRoom(): CallRoom | null { return this._callRoom; }
    get likeCount(): number { return this._likeCount; }
    get commentCount(): number { return this._commentCount; }
    get isLiked(): boolean { return this._isLiked; }
    get isAuthorFollowing(): boolean { return this._isAuthorFollowing; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get deletedAt(): Date | null { return this._deletedAt; }

    // 팩토리 메서드 : 서비스 계층에서 새로운 피드를 생성할때 사용
    static create(payload: {
        content: string | null;
        authorId: string;
        authorNickname: string;
        authorHandle: string;
        callRoom: CallRoom | null;
    }): Feed {
        const now = new Date();
        return new Feed(
            null,
            payload.content,
            payload.authorId,
            payload.authorNickname,
            payload.authorHandle,
            payload.callRoom,
            0,
            0,
            false,
            false,
            now,
            now,
            null,
        );
    }

    static restore(payload: {
        id: string;
        content: string | null;
        authorId: string;
        authorNickname: string;
        authorHandle: string;
        callRoom: CallRoom | null;
        likeCount: number;
        commentCount: number;
        isLiked?: boolean;
        isAuthorFollowing?: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }): Feed {
        return new Feed(
            payload.id,
            payload.content,
            payload.authorId,
            payload.authorNickname,
            payload.authorHandle,
            payload.callRoom,
            payload.likeCount,
            payload.commentCount,
            payload.isLiked ?? false,
            payload.isAuthorFollowing ?? false,
            payload.createdAt,
            payload.updatedAt,
            payload.deletedAt
        );
    }

    updateContent(newContent: string): void {
        this._content = newContent;
        this._updatedAt = new Date();
    }

    // 도메인 로직
    incrementLikeCount(): void {
        this._likeCount += 1;
    }

    decrementLikeCount(): void {
        if (this._likeCount > 0) {
            this._likeCount -= 1;
        }
    }

    // 도메인 비즈니스 로직 - 피드 삭제(soft)
    delete(): void {
        if (this._deletedAt) {
            throw new Error('이미 삭제된 피드입니다.')
        }
        this._deletedAt = new Date();
    }
}