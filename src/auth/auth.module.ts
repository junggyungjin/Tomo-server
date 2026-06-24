import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAdapter } from './adapter/out/jwt/jwt.adapter';
import { GENERATE_TOKEN_PORT } from './application/ports/out/generate-token.port';
import { JwtStrategy } from './adapter/in/jwt/jwt.strategy';
import { AuthController } from './adapter/in/web/auth.controller';
import { AuthService } from './application/services/auth.service';
import { GoogleAuthAdapter } from './adapter/out/google/google-auth.adapter';
import { VERIFY_SOCIAL_TOKEN_PORT } from './application/ports/out/verify-social-token.port';
import { MANAGE_REFRESH_TOKEN_PORT } from './application/ports/out/manage-refresh-token.port';
import { LOGIN_USECASE } from './application/ports/in/login.usecase';
import { REFRESH_TOKEN_USECASE } from './application/ports/in/refresh-token.usecase';
import { RefreshTokenPersistenceAdapter } from './adapter/out/persistence/refresh-token-persistence.adapter';
import { ConfigService } from '@nestjs/config';
import { DevLoginService } from './application/services/dev-login.service';
import { DEV_LOGIN_USECASE } from './application/ports/in/dev-login.usecase';
import { LogoutService } from './application/services/logout.service';
import { LOGOUT_USECASE } from './application/ports/in/logout.usecase';

@Module({
    imports: [
        UserModule, // Auth 서비스는 User 도메인의 기능(유저 조회/생성)을 사용해야 합니다.
        PassportModule, // Passport 기반의 인증(Strategy)을 사용하기 위해 등록
        JwtModule.registerAsync({
            // 주의: 실제 서비스에서는 반드시 .env 같은 환경변수로 관리해야 합니다.
            // Day 24(환경 설정 어댑터)에서 분리할 예정이므로 임시값을 사용합니다.
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
            }),
        })
    ], // Auth 서비스는 User 도메인의 기능(유저 조회/생성)을 사용해야 합니다.
    controllers: [AuthController],
    providers: [
        // --- 1. 일반 프로바이더 등록 ---
        JwtStrategy, // JwtStrategy를 Provider로 등록하여 NestJS가 주입(DI)할 수 있게 함
        AuthService, // 싱글톤 객체 1회 생성
        DevLoginService,
        LogoutService,
        // --- 2. Outbound 어댑터 연결 ---
        {
            provide: GENERATE_TOKEN_PORT,  // 인터페이스 대신 Symbol 사용
            useClass: JwtAdapter,
        },
        {
            provide: VERIFY_SOCIAL_TOKEN_PORT,
            useClass: GoogleAuthAdapter
        },
        {
            provide: MANAGE_REFRESH_TOKEN_PORT,
            useClass: RefreshTokenPersistenceAdapter
        },
        // --- 3. Inbound 유스케이스 연결 (useExisting 활용) ---
        {
            provide: LOGIN_USECASE,
            useExisting: AuthService // 이미 만들어진 AuthService를 재사용
        },
        {
            provide: REFRESH_TOKEN_USECASE,
            useExisting: AuthService // 이미 만들어진 AuthService를 재사용
        },
        {
            provide: DEV_LOGIN_USECASE,
            useExisting: DevLoginService
        },
        {
            provide: LOGOUT_USECASE,
            useExisting: LogoutService
        }
    ],
    exports: [
        GENERATE_TOKEN_PORT,
        VERIFY_SOCIAL_TOKEN_PORT,
        MANAGE_REFRESH_TOKEN_PORT,
        LOGIN_USECASE,
        REFRESH_TOKEN_USECASE,
        DEV_LOGIN_USECASE,
        LOGOUT_USECASE
    ],  // 다른 모듈에서 심볼을 통해 주입받을 수 있도록 export
})
export class AuthModule { }
