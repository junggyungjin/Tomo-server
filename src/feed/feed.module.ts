import { Module } from "@nestjs/common";
import { FeedController } from "./adapter/in/web/feed.controller";
import { FeedService } from "./application/services/feed.service";
import { FeedPersistenceAdapter } from "./adapter/out/persistence/feed-persistence.adapter";
import { CREATE_FEED_USE_CASE } from "./application/ports/in/create-feed.usecase";
import { GET_FEED_USE_CASE } from "./application/ports/in/get-feed.usecase";
import { FEED_REPOSITORY_PORT } from "./application/ports/out/feed.repository.port";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [FeedController],
    providers: [
        FeedService,
        FeedPersistenceAdapter,
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
    ],
})
export class FeedModule { }