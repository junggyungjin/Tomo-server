import { Module } from "@nestjs/common";
import { UserController } from "./adapter/in/web/user.controller";
import { UserService } from "./application/ports/services/user.service";
import { UserPersistenceAdapter } from "./adapter/out/persistence/user-persistence.adapter";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [
        // UserPersistenceAdapter가 PrismaService를 사용하므로 PrismaModule을 import합니다.
        PrismaModule,
    ],
    controllers: [
        // 1. In-Adapter: 이 모듈이 관리할 컨트롤러를 등록합니다.
        UserController,
    ],
    providers: [
        // 2. '추상(Port)'과 '구현(Adapter/Service)'을 연결합니다.
        {
            provide: 'CreateUserUseCase', // 누군가 'CreateUserUseCase'라는 이름표(Token)를 요청하면,
            useClass: UserService        // UserService 클래스의 인스턴스를 주입해줘!
        },
        {
            provide: 'UserRepositoryPort',      // 누군가 'UserRepositoryPort'라는 이름표(Token)를 요청하면,
            useClass: UserPersistenceAdapter,   // UserPersistenceAdapter 클래스의 인스턴스를 주입해줘!
        },
    ],
})
export class UserModule {}