import { Module } from "@nestjs/common";
import { FeedController } from "./adapter/in/web/feed.controller";
import { FeedService } from "./application/services/feed.service";
import { FeedPersistenceAdapter } from "./adapter/out/persistence/feed-persistence.adapter";
import { CREATE_FEED_USE_CASE } from "./application/ports/in/create-feed.usecase";
import { GET_FEED_USE_CASE } from "./application/ports/in/get-feed.usecase";
import { FEED_REPOSITORY_PORT } from "./application/ports/out/feed.repository.port";
import { UserModule } from "../user/user.module";
import { LIKE_FEED_USE_CASE } from "./application/ports/in/like-feed.usecase";
import { LikeFeedService } from "./application/services/like-feed.service";
import { FeedCommentController } from "./adapter/in/web/feed-comment.controller";
import { FeedCommentService } from "./application/services/feed-comment.service";
import { FeedCommentPersistenceAdapter } from "./adapter/out/persistence/feed-comment-persistence.adapter";
import { CREATE_FEED_COMMENT_USE_CASE } from "./application/ports/in/create-feed-comment.usecase";
import { GET_FEED_COMMENTS_USE_CASE } from "./application/ports/in/get-feed-comments.usecase";
import { FEED_COMMENT_REPOSITORY_PORT } from "./application/ports/out/feed-comment.repository.port";

@Module({
    imports: [UserModule],
    controllers: [
        FeedController,
        FeedCommentController
    ],
    providers: [
        FeedService,
        FeedPersistenceAdapter,
        LikeFeedService,
        FeedCommentService,
        FeedCommentPersistenceAdapter,
        {
            // 1. [Outbound] DB 포트에 대한 구현체 연결
            provide: FEED_REPOSITORY_PORT,
            useExisting: FeedPersistenceAdapter,
        },
        {
            // 2. [Inbound] 생성 UseCase 포트에 대한 구현체 연결
            provide: CREATE_FEED_USE_CASE,
            useExisting: FeedService,
        },
        {
            // 3. [Inbound] 조회 UseCase 포트에 대한 구현체 연결
            provide: GET_FEED_USE_CASE,
            useExisting: FeedService
        },
        {
            provide: LIKE_FEED_USE_CASE,
            useExisting: LikeFeedService,
        },
        {
            provide: FEED_COMMENT_REPOSITORY_PORT,
            useExisting: FeedCommentPersistenceAdapter,
        },
        {
            provide: CREATE_FEED_COMMENT_USE_CASE,
            useExisting: FeedCommentService,
        },
        {
            provide: GET_FEED_COMMENTS_USE_CASE,
            useExisting: FeedCommentService,
        }
    ],
})
export class FeedModule { }