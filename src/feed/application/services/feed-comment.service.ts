import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CreateFeedCommentCommand, CreateFeedCommentUseCase } from "../ports/in/create-feed-comment.usecase"
import { GetFeedCommentsUseCase, GetRepliesQuery, GetRootCommentsQuery } from "../ports/in/get-feed-comments.usecase"
import { FEED_COMMENT_REPOSITORY_PORT } from "../ports/out/feed-comment.repository.port"
import type { FeedCommentRepositoryPort } from "../ports/out/feed-comment.repository.port"
import { FeedComment } from "src/feed/domain/feed-comment.entity"
import { FEED_REPOSITORY_PORT } from "../ports/out/feed.repository.port"
import type { FeedRepositoryPort } from "../ports/out/feed.repository.port"

@Injectable()
export class FeedCommentService implements CreateFeedCommentUseCase, GetFeedCommentsUseCase {
    constructor(
        @Inject(FEED_COMMENT_REPOSITORY_PORT)
        private readonly feedCommentRepository: FeedCommentRepositoryPort,
        @Inject(FEED_REPOSITORY_PORT)
        private readonly feedRepository: FeedRepositoryPort,
    ) { }

    async execute(command: CreateFeedCommentCommand): Promise<FeedComment> {
        // 1. 피드 존재 및 삭제 여부 검증
        const feed = await this.feedRepository.findById(command.feedId);
        if (!feed || feed.deletedAt) {
            throw new NotFoundException('해당 피드를 찾을 수 없거나 삭제되었습니다.');
        }

        // 2. 대댓글일 경우, 부모 댓글 검증
        if (command.parentId) {
            const parentComment = await this.feedCommentRepository.findById(command.parentId);
            // 2-A. 부모 댓글 존재 및 삭제 여부 검증
            if (!parentComment || parentComment.deletedAt) {
                throw new NotFoundException('부모 댓글을 찾을 수 없거나 삭제되었습니다.');
            };

            // 2-B. 3-Depth 방지 (부모 댓글이 이미 대댓글인 경우 차단)
            if (parentComment.parentId !== null) {
                throw new BadRequestException('대댓글에는 답글을 달 수 없습니다.');
            }

            // 2-C. 부모 댓글이 속한 피드와 현재 작성하려는 피드가 일치하는지 검증 (어뷰징 방지)
            if (parentComment.feedId !== command.feedId) {
                throw new BadRequestException('잘못된 피드의 댓글입니다.');
            }
        }

        // 3. 도메인 엔티티 팩토리 메서드로 객체 생성
        const comment = FeedComment.create(
            command.feedId,
            command.authorId,
            command.authorHandle,
            command.content,
            command.authorNickname,
            command.parentId
        );

        // 4. Persistence 계층을 통해 저장
        return this.feedCommentRepository.save(comment);

    }

    async getRootComments(query: GetRootCommentsQuery): Promise<FeedComment[]> {
        const feed = await this.feedRepository.findById(query.feedId);
        if (!feed || feed.deletedAt) {
            throw new NotFoundException('해당 피드를 찾을 수 없거나 삭제되었습니다.');
        }

        return this.feedCommentRepository.findRootCommentsByFeedId(query.feedId);
    }

    async getReplies(query: GetRepliesQuery): Promise<FeedComment[]> {
        const parentComment = await this.feedCommentRepository.findById(query.parentCommentId);

        // 삭제된 부모 댓글의 대댓글 조회를 막거나 허용하는 것은 기획에 따라 다릅니다.
        // 보통 "삭제된 댓글입니다" 라고 표시하되, 밑에 달린 답글은 볼 수 있게 하는 경우가 많으므로 deletedAt 체크는 제외했습니다.
        if (!parentComment) {
            throw new NotFoundException('부모 댓글을 찾을 수 없습니다');
        }

        return this.feedCommentRepository.findRepliesByParentId(query.parentCommentId);
    }

}