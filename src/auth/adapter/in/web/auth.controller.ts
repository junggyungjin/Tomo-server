import { Controller, Post, Body, Param, Inject } from "@nestjs/common";
import { SocialLoginRequestDto } from './dto/social-login.request.dto';
import { LOGIN_USECASE } from '../../../application/ports/in/login.usecase';
import type { LoginUseCase } from "../../../application/ports/in/login.usecase";
import { LoginCommand } from '../../../application/ports/in/login.command';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(LOGIN_USECASE)
        private readonly loginUseCase: LoginUseCase,
    ) { }

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

        const tokens = await this.loginUseCase.login(command);

        return tokens;
    }
}