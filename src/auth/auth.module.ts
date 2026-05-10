import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule], // Auth 서비스는 User 도메인의 기능(유저 조회/생성)을 사용해야 합니다.
    controllers: [],
    providers: [
        //앞으로 구현할 LoginUseCase, GenerateTokenPort 등의 DI 설정을 추가할 예정
    ],
    exports: [],
})
export class AuthModule {}
