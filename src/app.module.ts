import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TomoController } from './tomo.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule
  ],
  controllers: [AppController, TomoController],
  providers: [AppService],
})
export class AppModule {}
