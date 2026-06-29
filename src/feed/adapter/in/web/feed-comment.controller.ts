import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { CreateFeedCommandRequestDto } from "./dto/create-feed-comment.request.dto";
import { FeedCommentResponseDto } from "./dto/feed-comment.response.dto";
import { CREATE_FEED_COMMENT_USE_CASE, CreateFeedCommentCommand } from "src/feed/application/ports/in/create-feed-comment.usecase";
import type { CreateFeedCommentUseCase } from 'src/feed/application/ports/in/create-feed-comment.usecase';
import { GET_FEED_COMMENTS_USE_CASE, GetRepliesQuery, GetRootCommentsQuery } from "src/feed/application/ports/in/get-feed-comments.usecase";
import type { GetFeedCommentsUseCase } from "src/feed/application/ports/in/get-feed-comments.usecase";
import { GET_USER_USECASE } from "src/user/application/ports/in/get-user.usecase";
import type { GetUserUseCase } from "src/user/application/ports/in/get-user.usecase";
import { OptionalJwtAuthGuard } from "src/common/guards/optional-jwt-auth.guard";

@ApiTags('Tomo Feed Comments')
@Controller('feeds/:feedId/comments')
export class FeedCommentController {
    constructor(
        @Inject(CREATE_FEED_COMMENT_USE_CASE)
        private readonly createFeedCommentUseCase: CreateFeedCommentUseCase,
        @Inject(GET_FEED_COMMENTS_USE_CASE)
        private readonly getFeedCommentsUseCase: GetFeedCommentsUseCase,
        @Inject(GET_USER_USECASE)
        private readonly getUserUseCase: GetUserUseCase,
    ) { }

    @ApiOperation({ summary: '피드 댓글 작성', description: '특정 피드에 댓글 또는 대댓글을 작성합니다.' })
    @SwaggerApiResponse({ status: 201, description: '댓글 작성 성공', type: FeedCommentResponseDto })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async craeteComment(
        @Param('feedId', ParseUUIDPipe) feedId: string,
        @CurrentUser() userPayload: { userId: string },
        @Body() dto: CreateFeedCommandRequestDto,
    ) {
        // 1. 유저 정보 조회 및 철저한 null 검증 (예외 처리)
        const user = await this.getUserUseCase.getUser(userPayload.userId);
        if (!user) {
            throw new UnauthorizedException('유효하지 않거나 탈퇴한 사용자입니다.');
        }

        // 2. Command 객체 생성
        const command = new CreateFeedCommentCommand(
            feedId,
            user.id,
            user.nickname ?? 'Unknown', // || 대신 ?? 사용 권장 (null/undefined만 체크)
            user.handle,
            dto.content,
            dto.parentId,
        )

        // 3. 비즈니스 로직 실행
        const comment = await this.createFeedCommentUseCase.execute(command);

        // 4. 응답 DTO로 변환하여 반환
        return ApiResponse.OK(FeedCommentResponseDto.from(comment));
    }

    @ApiOperation({ summary: '피드 최상위 댓글 조회', description: '특정 피드에 달린 최상위 댓글 목록을 과거순으로 조회합니다.' })
    @SwaggerApiResponse({ status: 200, description: '조회 성공', type: [FeedCommentResponseDto] })
    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    async getRootComments(
        @Param('feedId', ParseUUIDPipe) feedId: string,
    ) {
        const query = new GetRootCommentsQuery(feedId);
        const comments = await this.getFeedCommentsUseCase.getRootComments(query);

        const responseDtos = comments.map(c => FeedCommentResponseDto.from(c));
        return ApiResponse.OK(responseDtos);
    }

    @ApiOperation({ summary: '대댓글 목록 조회', description: '특정 댓글에 달린 대댓글 목록을 과거순으로 조회합니다.' })
    @SwaggerApiResponse({ status: 200, description: '조회 성공', type: [FeedCommentResponseDto] })
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':commentId/replies')
    async getReplies(
        @Param('feedId', ParseUUIDPipe) feedId: string,
        @Param('commentId', ParseUUIDPipe) commentId: string,
    ) {
        const query = new GetRepliesQuery(feedId, commentId);
        const replies = await this.getFeedCommentsUseCase.getReplies(query);

        const responseDtos = replies.map(r => FeedCommentResponseDto.from(r));
        return ApiResponse.OK(responseDtos);
    }
}