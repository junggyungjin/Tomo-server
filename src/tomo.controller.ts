import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1') // 공통 경로 설정
export class TomoController{
    constructor(private readonly appService: AppService) {}
    @Get('info') // localhost:3000/v1/info
    getInfo(): string {
        return this.appService.getInfo();
    }
}