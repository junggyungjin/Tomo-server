import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { LikeFeedUseCase, LikeFeedCommand, LikeFeedResult } from "../ports/in/like-feed.usecase";
import { FEED_REPOSITORY_PORT } from "../ports/out/feed.repository.port";
import type { FeedRepositoryPort } from "../ports/out/feed.repository.port";

@Injectable()
export class LikeFeedService implements LikeFeedUseCase {
    constructor(
        @Inject(FEED_REPOSITORY_PORT)
        private readonly feedRepository: FeedRepositoryPort,
    ) { }

    async execute(command: LikeFeedCommand): Promise<LikeFeedResult> {
        // 1. 피드 존재 여부
        const feed = await this.feedRepository.findById(command.feedId);
        if (!feed) {
            throw new NotFoundException('피드를 찾을 수 없습니다.');
        }

        // 2. 현재 상태 확인 및 목표 상태 정의
        const isCurrentLiked = await this.feedRepository.checkIfUserLiked(command.userId, command.feedId);
        const isTargetLike = !isCurrentLiked; // 이번 요청으로 변경될 최종 상태

        // 3. 도메인 메모리 상태 변경
        if (isTargetLike) {
            feed.incrementLikeCount();
        } else {
            feed.decrementLikeCount();
        }

        // 4. 단일 DB 어댑터 호출 (DRY 원칙)
        await this.feedRepository.toggleLike(command.userId, command.feedId, isTargetLike);

        // 5. 결과 반환
        return {
            isLiked: isTargetLike,
            likeCount: feed.likeCount,
        }
    }
}