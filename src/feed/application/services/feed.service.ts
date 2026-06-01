import { Inject, Injectable } from "@nestjs/common";
import { CreateFeedCommand, CreateFeedUseCase } from "../ports/in/create-feed.usecase";
import { GetFeedUseCase } from "../ports/in/get-feed.usecase";
import { FEED_REPOSITORY_PORT } from "../ports/out/feed.repository.port";
import type { FeedRepositoryPort } from "../ports/out/feed.repository.port";
import { Feed } from "src/feed/domain/feed.entity";
import { CallRoom } from "src/feed/domain/call-room.entity";

@Injectable()
export class FeedService implements CreateFeedUseCase, GetFeedUseCase {
    constructor(
        @Inject(FEED_REPOSITORY_PORT)
        private readonly feedRepository: FeedRepositoryPort,
    ) { }

    /**
     * [Command 유스케이스] 피드 게시글 생성
     */
    async execute(command: CreateFeedCommand): Promise<Feed> {
        // 1. 조건에 따라 하위 도메인인 CallRoom 엔티티를 팩토리 메서드로 생성
        // (외부 라이브러리나 날짜 세팅은 엔티티 내부에서 알아서 처리하도록 위임)
        const callRoom = command.hasCallRoom
            ? CallRoom.create({ maxParticipants: 4 }) // 앱 기획에 맞춰 기본 정원(예: 4명) 설정
            : null;

        // 2. 메인 도메인인 Feed 엔티티를 팩토리 메서드로 생성
        const feed = Feed.create({
            content: command.content,
            authorId: command.authorId,
            callRoom: callRoom,
        });

        // 3. 비즈니스 로직 처리가 끝난 순수 도메인 객체를 Out-Port를 통해 영속성 어댑터(Prisma)로 전달
        return this.feedRepository.save(feed);
    }

    /**
    * [Query 유스케이스] 전체 피드 목록 최신순 조회
    */
    async getFeeds(): Promise<Feed[]> {
        return this.feedRepository.findAll();
    }

    /**
    * [Query 유스케이스] 특정 피드 상세 조회
    */
    async getFeedById(feedId: string): Promise<Feed | null> {
        return this.feedRepository.findById(feedId);
    }
}