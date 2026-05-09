import { Module } from '@nestjs/common';
import { TomoController } from './tomo.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule
  ],
  controllers: [TomoController],
  providers: [],
})
export class AppModule {}
