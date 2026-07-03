import { User } from "src/user/domain/user.entity";

// NestJS DI를 위한 토큰
export const UPDATE_USER_PROFILE_USECASE = 'UPDATE_USER_PROFILE_USECASE';

// 외부(Controller)에서 내부(Service)로 전달되는 데이터 객체입니다.
export class UpdateUserProfileCommand {
    constructor(
        public readonly userId: string,
        public readonly nickname: string,
        public readonly nationality: string,
        public readonly gender: string,
        public readonly profileImageUrl: string,
        public readonly introduction?: string,
        public readonly coverImageUrl?: string,
    ) { }
}

// 외부(Controller)와 내부(Service)를 연결할 인터페이스
export interface UpdateUserProfileUseCase {
    updateProfile(command: UpdateUserProfileCommand): Promise<User>;
}