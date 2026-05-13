import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtAdapter } from './adapter/out/jwt/jwt.adapter';
import { GENERATE_TOKEN_PORT } from './application/ports/out/generate-token.port';
import { JwtStrategy } from './adapter/in/jwt/jwt.strategy';
import { AuthController } from './adapter/in/web/auth.controller';
import { AuthService } from './application/services/auth.service';
import { GoogleAuthAdapter } from './adapter/out/google/google-auth.adapter';
import { VERIFY_SOCIAL_TOKEN_PORT } from './application/ports/out/verify-social-token.port';
import { LOGIN_USECASE } from './application/ports/in/login.usecase';

@Module({
    imports: [
        UserModule, // Auth 서비스는 User 도메인의 기능(유저 조회/생성)을 사용해야 합니다.
        PassportModule, // Passport 기반의 인증(Strategy)을 사용하기 위해 등록
        JwtModule.register({
            // 주의: 실제 서비스에서는 반드시 .env 같은 환경변수로 관리해야 합니다.
            // Day 24(환경 설정 어댑터)에서 분리할 예정이므로 임시값을 사용합니다.
            secret: 'temporary-super-secret-key-for-tomo',
        })
    ], // Auth 서비스는 User 도메인의 기능(유저 조회/생성)을 사용해야 합니다.
    controllers: [AuthController],
    providers: [
        {
            provide: GENERATE_TOKEN_PORT,  // 인터페이스 대신 Symbol 사용
            useClass: JwtAdapter,
        },
        JwtStrategy, // JwtStrategy를 Provider로 등록하여 NestJS가 주입(DI)할 수 있게 함
        {
            provide: VERIFY_SOCIAL_TOKEN_PORT,
            useClass: GoogleAuthAdapter
        },
        {
            provide: LOGIN_USECASE,
            useClass: AuthService
        }
    ],
    exports: [GENERATE_TOKEN_PORT, VERIFY_SOCIAL_TOKEN_PORT, LOGIN_USECASE],  // 다른 모듈에서 심볼을 통해 주입받을 수 있도록 export
})
export class AuthModule { }
