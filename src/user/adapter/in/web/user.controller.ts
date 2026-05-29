import { Controller, Post, Body, Inject, Patch, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { UpdateUserProfileRequestDto } from './dto/update-user-profile.request.dto';
import { CreateUserCommand } from '../../../application/ports/in/create-user.usecase';
import type { CreateUserUseCase } from '../../../application/ports/in/create-user.usecase';
import { ApiResponse } from '../../../../common/dto/api-response.dto';
import { UPDATE_USER_PROFILE_USECASE, UpdateUserProfileCommand } from '../../../application/ports/in/update-user-profile.usecase';
import type { UpdateUserProfileUseCase } from '../../../application/ports/in/update-user-profile.usecase';
import { GET_USER_USECASE } from '../../../application/ports/in/get-user.usecase';
import type { GetUserUseCase } from '../../../application/ports/in/get-user.usecase';

// Swagger 문서 카테고리화 및 라우터 설정
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        @Inject('CreateUserUseCase')
        private readonly createUserUseCase: CreateUserUseCase,

        @Inject(UPDATE_USER_PROFILE_USECASE)
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,

        @Inject(GET_USER_USECASE)
        private readonly getUserUseCase: GetUserUseCase,
    ) { }

    @ApiOperation({ summary: '새 사용자 생성', description: '소셜 로그인 후 신규 사용자를 생성합니다.' })
    @ApiBody({ type: CreateUserRequestDto })
    @SwaggerApiResponse({
        status: 201,
        description: '사용자 생성 성공',
        schema: {
            example: {
                success: true,
                timestamp: '2026-05-25T10:00:00.000Z',
                data: {
                    id: 'uuid-string',
                    provider: 'google',
                    providerId: '123456789',
                    email: 'user@example.com',
                    nickname: 'TomoUser',
                    handle: '@tomouser',
                    nationality: 'KR',
                    gender: null,
                    profileImageUrl: null,
                    status: 'PENDING',
                    createdAt: '2026-05-27T10:00:00.000Z'
                }
            }
        }
    })
    @Post()
    async createUser(
        @Body() request: CreateUserRequestDto,
    ) {
        // 1. DTO 데이터를 핵사고날 내부에서 쓰는 Command로 변환
        const command = new CreateUserCommand(
            request.provider,
            request.providerId,
            request.nickname,
            request.nationality,
            request.email || undefined,
            request.handle || undefined,
        );

        // 2. UseCase(포트)를 통해 비즈니스 로직 실행
        const user = await this.createUserUseCase.createUser(command);

        // 3. 결과 반환 (클라이언트에게 JSON으로 응답됨)
        return ApiResponse.OK(user);
    }



    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '사용자 프로필 업데이트', description: '사용자의 프로필 정보를 수정합니다.' })
    @ApiBody({ type: UpdateUserProfileRequestDto })
    @SwaggerApiResponse({
        status: 200,
        description: '프로필 업데이트 성공',
        schema: {
            example: {
                success: true,
                timestamp: '2026-05-25T10:00:00.000Z',
                data: {
                    id: 'uuid-string',
                    provider: 'google',
                    providerId: '123456789',
                    email: 'user@example.com',
                    nickname: 'NewTomo',
                    handle: '@tomouser',
                    nationality: 'KR',
                    gender: 'MALE',
                    profileImageUrl: 'https://example.com/profile.jpg',
                    status: 'ACTIVE',
                    createdAt: '2026-05-27T10:00:00.000Z'
                }
            }
        }
    })
    @UseGuards(AuthGuard('jwt')) // ADDED: JWT 가드 적용
    @Patch('profile')
    async updateProfile(
        @CurrentUser() userPayload: { userId: string },
        @Body() request: UpdateUserProfileRequestDto,
    ) {
        // 1. DTO를 Command로 변환
        const command = new UpdateUserProfileCommand(
            userPayload.userId, // 추후 JWT Guard 적용 시 req.user.id 로 교체 예정
            request.nickname,
            request.nationality,
            request.gender || '',
            request.profileImageUrl || '',
        );

        // 2. UseCase 실행
        const user = await this.updateUserProfileUseCase.updateProfile(command);

        // 3. 결과 반환
        return ApiResponse.OK(user);
    }


    // 내 정보 조회(세션 검증) 엔드포인트 구현
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '내 정보 조회', description: '발급받은 JWT(Access Token)를 검증하고 현재 유저의 프로필을 반환합니다.' })
    @SwaggerApiResponse({
        status: 200,
        description: '조회 성공',
        schema: {
            example: {
                success: true,
                timestamp: '2026-05-29T10:00:00.000Z',
                data: {
                    id: 'uuid-string',
                    provider: 'google',
                    nickname: 'TomoUser',
                    status: 'ACTIVE',
                }
            }
        }
    })
    @UseGuards(AuthGuard('jwt')) // JWT 토큰 검증 미들웨어
    @Get('me')
    // @Req() req: any 대신 커스텀 데코레이터 적용
    async getMe(@CurrentUser() userPayload: { userId: string }) {
        // 프레임워크의 req 객체를 직접 뒤지지 않고 페이로드에서 바로 추출합니다.
        const user = await this.getUserUseCase.getUser(userPayload.userId);

        return ApiResponse.OK(user);
    }
}