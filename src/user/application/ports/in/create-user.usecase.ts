import { User } from "src/user/domain/user.entity";

// 외부에서 전달받을 데이터 묶음
export class CreateUserCommand {
    constructor(
        public readonly nickname: string,
        public readonly natinality: string,
    ) {}
}

// 외부(Controller)와 내부(Service)를 연결할 인터페이스
export interface CreateUserUseCase {
    createUser(command: CreateUserCommand): Promise<User>;
}