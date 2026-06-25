import { Module } from "@nestjs/common";
import { UserController } from "./adapter/in/web/user.controller";
import { UserService } from "./application/ports/services/user.service";
import { UserPersistenceAdapter } from "./adapter/out/persistence/user-persistence.adapter";
import { AuthUserFacade } from "./adapter/in/internal/auth-user.facade";
import { GET_OR_CREATE_USER_PORT } from "src/auth/application/ports/out/get-or-create-user.port";
import { UPDATE_USER_PROFILE_USECASE } from "./application/ports/in/update-user-profile.usecase";
import { GET_USER_USECASE } from "./application/ports/in/get-user.usecase";
import { CREATE_USER_USECASE } from "./application/ports/in/create-user.usecase";
import { USER_REPOSITORY_PORT } from "./application/ports/out/user.repository.port";
import { FollowPersistenceAdapter } from "./adapter/out/persistence/follow-persistence.adapter";
import { FOLLOW_REPOSITORY_PORT } from "./application/ports/out/follow.repository.port";
import { FOLLOW_USER_USECASE } from "./application/ports/in/follow-user.usecase";

@Module({
    controllers: [
        // 1. In-Adapter: 이 모듈이 관리할 컨트롤러를 등록합니다.
        UserController,
    ],
    providers: [
        UserService,
        UserPersistenceAdapter,
        FollowPersistenceAdapter,
        AuthUserFacade,
        // 2. '추상(Port)'과 '구현(Adapter/Service)'을 연결합니다.
        {
            provide: CREATE_USER_USECASE, // 누군가 'CreateUserUseCase'라는 이름표(Token)를 요청하면,
            useExisting: UserService        // UserService 클래스의 인스턴스를 주입해줘!
        },
        {
            provide: UPDATE_USER_PROFILE_USECASE,
            useExisting: UserService
        },
        {
            provide: GET_USER_USECASE,
            useExisting: UserService
        },
        {
            provide: USER_REPOSITORY_PORT,      // 누군가 'UserRepositoryPort'라는 이름표(Token)를 요청하면,
            useClass: UserPersistenceAdapter,   // UserPersistenceAdapter 클래스의 인스턴스를 주입해줘!
        },
        {
            provide: GET_OR_CREATE_USER_PORT,
            useClass: AuthUserFacade
        },
        {
            provide: FOLLOW_REPOSITORY_PORT,
            useClass: FollowPersistenceAdapter,
        },
        {
            provide: FOLLOW_USER_USECASE,
            useExisting: UserService
        }
    ],
    exports: [GET_OR_CREATE_USER_PORT, GET_USER_USECASE]
})
export class UserModule { }