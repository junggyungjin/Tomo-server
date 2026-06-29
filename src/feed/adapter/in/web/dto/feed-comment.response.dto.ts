import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FeedComment } from "src/feed/domain/feed-comment.entity";

export class FeedCommentResponseDto {
    @ApiProperty({ description: '댓글 고유 ID' })
    readonly id!: string;

    @ApiProperty({ description: '소속된 피드 ID' })
    readonly feedId!: string;

    @ApiProperty({ description: '작성자 고유 식별자 (삭제 시 마스킹 됨)' })
    readonly authorId!: string;

    @ApiProperty({ description: '작성자 고유 핸들 (삭제 시 마스킹 됨)' })
    readonly authorHandle!: string;

    @ApiProperty({ description: '댓글 내용 (삭제 시 안내 문구로 대체 됨)' })
    readonly content!: string;

    @ApiProperty({ description: '댓글 작성 일시' })
    readonly createdAt!: Date;

    @ApiProperty({ description: '대댓글 개수' })
    readonly replyCount!: number;

    @ApiPropertyOptional({ description: '작성자 닉네임' })
    readonly authorNickname?: string;

    @ApiPropertyOptional({ description: '대댓글인 경우 부모 댓글의 ID' })
    readonly parentId?: string;

    private constructor(
        id: string,
        feedId: string,
        authorId: string,
        authorHandle: string,
        content: string,
        createdAt: Date,
        replyCount: number,
        authorNickname?: string,
        parentId?: string,
    ) {
        this.id = id;
        this.feedId = feedId;
        this.authorId = authorId;
        this.authorHandle = authorHandle;
        this.content = content;
        this.createdAt = createdAt;
        this.replyCount = replyCount;
        this.authorNickname = authorNickname;
        this.parentId = parentId;
    }

    /**
     * 도메인 엔티티를 클라이언트 전달용 DTO로 변환하며,
     * 삭제된 데이터에 대한 마스킹 처리를 수행합니다
     */
    static from(comment: FeedComment): FeedCommentResponseDto {
        // 도메인 엔티티에 deletedAt이 존재한다면 삭제된 댓글로 간주
        const isDeleted = comment.deletedAt !== null;

        return new FeedCommentResponseDto(
            comment.id!,
            comment.feedId,
            isDeleted ? 'deleted_user' : comment.authorId,
            isDeleted ? 'unknown' : comment.authorHandle,
            isDeleted ? '삭제된 댓글입니다.' : comment.content,
            comment.createdAt,
            comment.replyCount,
            isDeleted ? undefined : (comment.authorNickname ?? undefined),
            comment.parentId ?? undefined,
        )
    }
}