import { Injectable } from '@nestjs/common';
import { GetOrCreateUserPort, AuthUserProfile } from 'src/auth/application/ports/out/get-or-create-user.port';
import { UserService } from 'src/user/application/ports/services/user.service';
import { CreateUserCommand } from 'src/user/application/ports/in/create-user.usecase';

@Injectable()
export class AuthUserFacade implements GetOrCreateUserPort {
    constructor(private readonly userService: UserService) { }

    async getOrCreateUser(provider: string, providerId: string): Promise<{
        user: AuthUserProfile;
        isNewUser: boolean
    }> {
        // 1. UserService를 통해 기존 유저가 있는지 확인
        let user = await this.userService.getUserByProvider(provider, providerId);
        let isNewUser = false;

        // 2. 없으면 새로 생성
        if (!user) {
            const command = new CreateUserCommand(
                provider,
                providerId,
                `User_${providerId.substring(0, 6)}`, // 기본 닉네임
                'UNKNOWN' // 기본 국적
            );
            user = await this.userService.createUser(command);
            isNewUser = true;

        }

        return {
            user: {
                id: user.id,
                handle: user.handle,
                status: user.status,
            },
            isNewUser
        };
    }
}