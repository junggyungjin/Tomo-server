import { Module } from '@nestjs/common';
import { TomoController } from './tomo.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정하여 어디서든 ConfigService 사용 가능
    }),
    PrismaModule,
    UserModule,
    AuthModule
  ],
  controllers: [TomoController],
  providers: [],
})
export class AppModule { }
