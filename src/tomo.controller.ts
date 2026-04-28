import { Controller, Get } from '@nestjs/common';

@Controller('v1') // 공통 경로 설정
export class TomoController {
    @Get('info') // localhost:3000/v1/info
    getInfo(): string {
        return 'tomo 백엔드 v1.0 준비 중';
    }
}