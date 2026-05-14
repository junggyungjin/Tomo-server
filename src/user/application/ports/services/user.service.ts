import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserUseCase, CreateUserCommand } from '../in/create-user.usecase';
import type { UserRepositoryPort } from '../out/user.repository.port';
import { User } from 'src/user/domain/user.entity';

@Injectable()
export class UserService implements CreateUserUseCase {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async createUser(command: CreateUserCommand): Promise<User> {
        // 이미 가입된 유저인지 확인합니다.
        const existingUser = await this.userRepository.findByProvider(
            command.provider,
            command.providerId,
        );
        if (existingUser) throw new ConflictException('이미 가입된 유저입니다.');

        // 1. 유저의 고유 ID는 우리 서비스에서 생성합니다.
        const newUserId = randomUUID();

        // 2. 핸들(고유 아이디) 결정 및 중복 검사
        const handle = await this.generateUniqueHandle(command.handle);

        const createdAt = new Date();

        const user = new User(
            newUserId,
            command.provider,
            command.providerId,
            command.email || null,
            command.nickname,
            handle, // 이제 handle은 string 타입이 보장
            command.nationality,
            createdAt
        );

        const savedUser = await this.userRepository.save(user);

        return savedUser;
    }

    // 소셜 로그인 연동 시 기존 유저를 찾기 위한 메서드
    async getUserByProvider(provider: string, providerId: string): Promise<User | null> {
        return this.userRepository.findByProvider(provider, providerId);
    }

    private async generateUniqueHandle(providedHandle: string | null | undefined): Promise<string> {
        if (providedHandle) {
            const existing = await this.userRepository.findByHandle(providedHandle);
            if (existing) {
                throw new ConflictException('이미 사용중인 핸들입니다.');
            }
            return providedHandle;
        }

        // 사용자가 핸들을 입력하지 않은 경우, 유니크한 핸들을 찾을 때까지 반복합니다.
        while (true) {
            const handle = `user_${randomUUID().substring(0, 8)}`;
            const existing = await this.userRepository.findByHandle(handle);
            if (!existing) {
                return handle;
            }
        }
    }
}