import { Module } from '@nestjs/common';
import { TomoController } from './tomo.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule
  ],
  controllers: [TomoController],
  providers: [],
})
export class AppModule {}
