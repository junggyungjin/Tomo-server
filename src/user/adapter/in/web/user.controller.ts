import { Controller, Post, Body, Inject, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { UpdateUserProfileRequestDto } from './dto/update-user-profile.request.dto';
import { CreateUserCommand } from '../../../application/ports/in/create-user.usecase';
import type { CreateUserUseCase } from '../../../application/ports/in/create-user.usecase';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UPDATE_USER_PROFILE_USECASE, UpdateUserProfileCommand } from 'src/user/application/ports/in/update-user-profile.usecase';
import type { UpdateUserProfileUseCase } from 'src/user/application/ports/in/update-user-profile.usecase';
import { timestamp } from 'rxjs';

// Swagger 문서 카테고리화 및 라우터 설정
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        @Inject('CreateUserUseCase')
        private readonly createUserUseCase: CreateUserUseCase,

        @Inject(UPDATE_USER_PROFILE_USECASE)
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
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
                data: { id: 'uuid', nickname: 'TomoUser', provider: 'google', providerId: '123' }
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
                data: { id: 'uuid', nickname: 'NewTomo', nationality: 'KR' }
            }
        }
    })
    @Patch('profile')
    async updateProfile(
        @Body() request: UpdateUserProfileRequestDto,
    ) {
        // 1. DTO를 Command로 변환
        const command = new UpdateUserProfileCommand(
            request.userId, // 추후 JWT Guard 적용 시 req.user.id 로 교체 예정
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
}