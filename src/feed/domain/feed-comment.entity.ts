export interface FeedCommentProps {
    id: string | null;
    feedId: string;
    authorId: string;
    authorHandle: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorNickname?: string | null;
    parentId?: string | null;
    deletedAt?: Date | null;

    // 클라이언트에 전달하기 위한 읽기 전용 프로젝션 데이터
    replyCount?: number;
}

export class FeedComment {
    // 1. 캡슐화: 모두 private 변수로 은닉 (언더스코어 네이밍 컨벤션 적용)
    private _id: string | null;
    private readonly _feedId: string;
    private readonly _authorId: string;
    private readonly _authorHandle: string;
    private _content: string; // 수정 가능하므로 readonly 제외
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private readonly _authorNickname: string | null;
    private readonly _parentId: string | null;
    private _deletedAt: Date | null;
    private readonly _replyCount: number;

    // 외부엣거 임의로 객체 생성을 막기 위해 private 생성자 사용
    private constructor(props: FeedCommentProps) {
        this._id = props.id;
        this._feedId = props.feedId;
        this._authorId = props.authorId;
        this._authorHandle = props.authorHandle;
        this._content = props.content;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._authorNickname = props.authorNickname ?? null;
        this._parentId = props.parentId ?? null;
        this._deletedAt = props.deletedAt ?? null;
        this._replyCount = props.replyCount ?? 0;
    }

    // 2. 외부 조회를 위한 안전한 Getters
    get id(): string | null { return this._id; }
    get feedId(): string { return this._feedId; }
    get authorId(): string { return this._authorId; }
    get authorHandle(): string { return this._authorHandle; }
    get content(): string { return this._content; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get authorNickname(): string | null { return this._authorNickname; }
    get parentId(): string | null { return this._parentId; }
    get deletedAt(): Date | null { return this._deletedAt; }
    get replyCount(): number { return this._replyCount; }

    /**
     * DB에서 가져온 데이터를 엔티티로 복원할때 사용하는 팩토리 메서드
     */
    static from(props: Omit<FeedCommentProps, 'id'> & { id: string }): FeedComment {
        // 복원 시점에는 반드시 id가 존재해야 하므로 타입 강제
        return new FeedComment(props);
    }

    /**
     * 사용자가 새로운 댓글을 작성할 때 사용하는 팩토리 메서드
     */
    static create(
        feedId: string,
        authorId: string,
        authorHandle: string,
        content: string,
        authorNickname?: string | null,
        parentId?: string | null
    ): FeedComment {
        const now = new Date();
        return new FeedComment({
            id: null, // 명시적으로 null 처리하여 DB 위임 표현
            feedId,
            authorId,
            authorHandle,
            content,
            createdAt: now,
            updatedAt: now,
            authorNickname,
            parentId,
            deletedAt: null,
            replyCount: 0,
        });
    }

    // 3. 도메인 비즈니스 로직 - 댓글 내용 수정
    updatedContent(newContent: string): void {
        if (this._deletedAt) {
            throw new Error('삭제된 댓글은 수정할 수 없습니다.');
        }
        this._content = newContent;
        this._updatedAt = new Date();
    }

    /**
     * 댓글 삭제 처리 
     */
    delete(): void {
        if (this._deletedAt) {
            throw new Error('이미 삭제된 댓글입니다.');
        }
        this._deletedAt = new Date();
    }
}