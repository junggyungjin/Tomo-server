import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    UseGuards,
    NotFoundException,
    Query,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { CreateFeedRequestDto } from './dto/create-feed.request.dto'
import { FeedResponseDto } from './dto/feed.response.dto'
import {
    CREATE_FEED_USE_CASE,
    CreateFeedCommand,
} from 'src/feed/application/ports/in/create-feed.usecase';
import { LikeFeedResponseDto } from './dto/like-feed.response.dto'
import type { CreateFeedUseCase } from 'src/feed/application/ports/in/create-feed.usecase'
import {
    GET_FEED_USE_CASE,
} from 'src/feed/application/ports/in/get-feed.usecase'
import type { GetFeedUseCase } from 'src/feed/application/ports/in/get-feed.usecase'
import { ApiResponse } from 'src/common/dto/api-response.dto'
import { GET_USER_USECASE } from 'src/user/application/ports/in/get-user.usecase'
import type { GetUserUseCase } from 'src/user/application/ports/in/get-user.usecase'
import { LIKE_FEED_USE_CASE, LikeFeedCommand } from 'src/feed/application/ports/in/like-feed.usecase'
import type { LikeFeedUseCase } from 'src/feed/application/ports/in/like-feed.usecase'
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard'

@ApiTags('Tomo Feeds')
@Controller('feeds')
export class FeedController {
    constructor(
        @Inject(CREATE_FEED_USE_CASE)
        private readonly createFeedUseCase: CreateFeedUseCase,
        @Inject(GET_FEED_USE_CASE)
        private readonly getFeedUseCase: GetFeedUseCase,
        @Inject(GET_USER_USECASE)
        private readonly getUserUseCase: GetUserUseCase,
        @Inject(LIKE_FEED_USE_CASE)
        private readonly likeFeedUseCase: LikeFeedUseCase,
    ) { }

    @ApiOperation({ summary: '피드 작성', description: '익명 보이스 채팅방을 포함할 수 있는 새로운 피드를 생성합니다.' })
    @ApiBody({ type: CreateFeedRequestDto })
    @SwaggerApiResponse({
        status: 201,
        description: '피드 생성 성공',
        type: FeedResponseDto // Swagger 명세서에 Response DTO의 형태를 그대로 띄움
    })
    // 2. 글을 작성하는 방(POST) 문 앞에만 경비원을 세웁니다!
    @ApiBearerAuth('access-token') // Swagger에도 "이 API는 자물쇠 채워짐" 표시
    @UseGuards(AuthGuard('jwt')) //  실제 로그인 검사 수행
    @Post()
    async createFeed(
        @CurrentUser() userPayload: { userId: string },
        @Body() dto: CreateFeedRequestDto,
    ) {
        // 1. 유저 정보 조회 (닉네임과 핸들 필요)
        const user = await this.getUserUseCase.getUser(userPayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. 커맨드에 닉네임과 핸들 추가
        const command = new CreateFeedCommand(
            user.id,
            user.nickname || 'Unknown',
            user.handle,
            dto.content ?? null,
            dto.hasCallRoom,
        );

        // 3. 유스케이스 실행 (엔티티 반환)
        const feed = await this.createFeedUseCase.execute(command);

        // 엔티티를 클라이언트용 DTO로 안전하게 전달
        return ApiResponse.OK(FeedResponseDto.from(feed))
    }

    @ApiOperation({ summary: '전체 피드 목록 조회', description: '생성된 모든 피드와 열려있는 통화방 목록을 최신순으로 조회합니다.' })
    @ApiQuery({ name: 'filter', required: false, enum: ['all', 'following'], description: 'all: 전체, following: 팔로잉 피드' })
    @SwaggerApiResponse({ status: 200, description: '조회 성공', type: FeedResponseDto })
    @ApiBearerAuth('access-token')
    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    async getFeeds(
        @CurrentUser() userPayload?: { userId: string },
        @Query('filter') filter?: 'all' | 'following',
    ) {
        // 토큰이 유효하면 userPayload.userId가 존재하고, 토큰이 없거나 만료면 undefined가 됩니다.
        const viewerId = userPayload?.userId;

        if (filter === 'following' && !viewerId) {
            throw new UnauthorizedException('팔로잉 피드를 보려면 로그인이 필요합니다.');
        }

        const feeds = await this.getFeedUseCase.getFeeds(viewerId, filter);

        // 배열 안에 있는 다수의 엔티티들을 map을 통해 전부 DTO로 변환
        const responseDtos = feeds.map(feed => FeedResponseDto.from(feed));
        return ApiResponse.OK(responseDtos);
    }

    @ApiOperation({ summary: '특정 피드 상세 조회', description: '피드 ID를 통해 특정 피드의 상세 정보와 통화방 상태를 조회합니다.' })
    @SwaggerApiResponse({ status: 200, description: '조회 성공', type: FeedResponseDto })
    @ApiBearerAuth('access-token')
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    async getFeedById(
        @Param('id') feedId: string,
        @CurrentUser() userPayload?: { userId: string }
    ) {
        const viewerId = userPayload?.userId;
        const feed = await this.getFeedUseCase.getFeedById(feedId, viewerId);

        if (!feed) {
            // 프론트엔드와 맞춘 에러 응답 규격에 따라 예외 처리 (예: NotFoundException)
            return ApiResponse.OK(null);
        }

        return ApiResponse.OK(FeedResponseDto.from(feed));
    }

    @ApiOperation({ summary: '피드 좋아요 토글', description: '특정 피드에 좋아요를 추가하거나 취소합니다.' })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @SwaggerApiResponse({ status: 200, description: '좋아요 처리 성공', type: LikeFeedResponseDto })
    @Post(':id/like')
    async toggleLike(
        @Param('id') feedId: string,
        @CurrentUser() userPayload: { userId: string },
    ) {
        const command = new LikeFeedCommand(userPayload.userId, feedId);

        const result = await this.likeFeedUseCase.execute(command);

        return ApiResponse.OK(LikeFeedResponseDto.from(result));
    }
}