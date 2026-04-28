import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TomoController } from './tomo.controller';

@Module({
  imports: [],
  controllers: [AppController, TomoController],
  providers: [AppService],
})
export class AppModule {}
