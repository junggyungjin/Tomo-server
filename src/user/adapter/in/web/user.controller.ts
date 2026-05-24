import { Controller, Post, Body, Inject, Patch } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { UpdateUserProfileRequestDto } from './dto/update-user-profile.request.dto';
import { CreateUserCommand } from '../../../application/ports/in/create-user.usecase';
import type { CreateUserUseCase } from '../../../application/ports/in/create-user.usecase';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UPDATE_USER_PROFILE_USECASE, UpdateUserProfileCommand } from 'src/user/application/ports/in/update-user-profile.usecase';
import type { UpdateUserProfileUseCase } from 'src/user/application/ports/in/update-user-profile.usecase';

@Controller('users')
export class UserController {
    constructor(
        @Inject('CreateUserUseCase')
        private readonly createUserUseCase: CreateUserUseCase,

        @Inject(UPDATE_USER_PROFILE_USECASE)
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    ) { }

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
            request.email,
            request.handle,
        );

        // 2. UseCase(포트)를 통해 비즈니스 로직 실행
        const user = await this.createUserUseCase.createUser(command);

        // 3. 결과 반환 (클라이언트에게 JSON으로 응답됨)
        return ApiResponse.OK(user);
    }

    @Patch('profile')
    async updateProfile(
        @Body() request: UpdateUserProfileRequestDto,
    ) {
        // 1. DTO를 Command로 변환
        const command = new UpdateUserProfileCommand(
            request.userId, // 추후 JWT Guard 적용 시 req.user.id 로 교체 예정
            request.nickname,
            request.nationality,
            request.gender,
            request.profileImageUrl,
        );

        // 2. UseCase 실행
        const user = await this.updateUserProfileUseCase.updateProfile(command);

        // 3. 결과 반환
        return ApiResponse.OK(user);
    }
}