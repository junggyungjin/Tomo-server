import { Controller, Post, Body, Param, Inject, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { SocialLoginRequestDto } from './dto/social-login.request.dto';
import { RefreshTokenRequestDto } from "./dto/refresh-token.request.dto";
import { LOGIN_USECASE } from '../../../application/ports/in/login.usecase';
import type { LoginUseCase } from "../../../application/ports/in/login.usecase";
import { LoginCommand } from '../../../application/ports/in/login.command';
import { REFRESH_TOKEN_USECASE } from "src/auth/application/ports/in/refresh-token.usecase";
import type { RefreshTokenUseCase } from "src/auth/application/ports/in/refresh-token.usecase";
import { RefreshTokenCommand } from "src/auth/application/ports/in/refresh-token.usecase";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { DevLoginRequestDto } from "./dto/dev-login.request.dto";
import { DEV_LOGIN_USECASE } from "src/auth/application/ports/in/dev-login.usecase";
import type { DevLoginUseCase } from "src/auth/application/ports/in/dev-login.usecase";
import { DevLoginCommand } from "src/auth/application/ports/in/dev-login.usecase";
import { ForbiddenException } from "@nestjs/common";

// Swagger 문서 카테고리화 및 라우터 설정
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(LOGIN_USECASE)
        private readonly loginUseCase: LoginUseCase,

        @Inject(REFRESH_TOKEN_USECASE)
        private readonly refreshTokenUseCase: RefreshTokenUseCase,

        @Inject(DEV_LOGIN_USECASE)
        private readonly devLoginUseCase: DevLoginUseCase,
    ) { }

    // Swagger 문서화 데코레이터 추가
    @ApiOperation({ summary: '소셜 로그인', description: '제공된 소셜 토큰을 검증하고, 회원가입/로그인 처리 후 JWT를 발급합니다.' })
    @ApiParam({ name: 'provider', description: '소셜 로그인 제공자 (예: google, apple, kakao, line)', example: 'google' })
    @ApiBody({ type: SocialLoginRequestDto })
    @SwaggerApiResponse({
        status: 200,
        description: '로그인 성공 및 JWT 발급',
        schema: {
            example: {
                success: true,
                timestamp: '2026-05-25T10:00:00.000Z',
                data: {
                    // FIXED: 인터페이스 구조에 맞게 완벽하게 재배치했습니다.
                    accessToken: 'eyJhbGci...',
                    refreshToken: 'eyJhbGci...',
                    user: {
                        id: 'uuid-string',
                        handle: '@tomouser',
                        status: 'ACTIVE'
                    },
                    isNewUser: false
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('login/:provider')
    async login(
        @Param('provider') provider: string,
        @Body() dto: SocialLoginRequestDto,
    ) {
        const command = new LoginCommand(
            provider,
            dto.providerId,
            dto.token,
            dto.email,
            dto.name
        );

        const result = await this.loginUseCase.login(command);

        return ApiResponse.OK(result);
    }

    @ApiOperation({ summary: '토큰 갱신', description: '만료된 Access Token을 Refresh Token을 통해 갱신합니다.' })
    @ApiBody({ type: RefreshTokenRequestDto })
    @SwaggerApiResponse({
        status: 200,
        description: '토큰 갱신 성공 (새로운 Access/Refresh 토큰 쌍 발급)',
        schema: {
            example: {
                success: true,
                timestamp: '2026-05-29T10:00:00.000Z',
                data: {
                    accessToken: 'new_eyJhbGci...',
                    refreshToken: 'new_eyJhbGci...',
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(
        @Body() dto: RefreshTokenRequestDto
    ) {
        const command = new RefreshTokenCommand(dto.refreshToken);
        const result = await this.refreshTokenUseCase.refresh(command);

        return ApiResponse.OK(result);
    }

    @ApiOperation({ summary: '개발 환경 전용 로그인 (운영 환경 사용 불가)', description: '소셜 검증 없이 원하는 ID로 즉시 토큰을 발급받습니다.' })
    @ApiBody({ type: DevLoginRequestDto })
    @SwaggerApiResponse({
        status: 200,
        description: '가짜 로그인 성공 및 JWT 발급',
    })
    @HttpCode(HttpStatus.OK)
    @Post('dev/login')
    async devLogin(
        @Body() dto: DevLoginRequestDto
    ) {
        if (process.env.NODE_ENV === 'production') {
            throw new ForbiddenException('운영 환경에서는 사용할 수 없는 API입니다.');
        }

        const command = new DevLoginCommand(dto.providerId);
        const result = await this.devLoginUseCase.devLogin(command);

        return ApiResponse.OK(result);
    }
}