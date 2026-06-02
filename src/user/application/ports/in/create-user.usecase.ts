import { User } from "src/user/domain/user.entity";

// 외부(Controller)에서 내부(Service)로 전달되는 완전한 데이터 객체입니다.
// 회원가입 유스케이스를 실행하는데 필요한 모든 정보를 담고 있습니다.
export class CreateUserCommand {
    constructor(
        public readonly provider: string,
        public readonly providerId: string,
        public readonly nickname: string,
        public readonly nationality: string,
        // email과 handle은 선택적으로 받을 수 있으므로 ?를 사용합니다.
        public readonly email?: string | null,
        public readonly handle?: string | null,
    ) { }
}

export const CREATE_USER_USECASE = Symbol('CREATE_USER_USECASE');

// 외부(Controller)와 내부(Service)를 연결할 인터페이스
export interface CreateUserUseCase {
    createUser(command: CreateUserCommand): Promise<User>;
}