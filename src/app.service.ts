import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello tomo!';
  }
  getTomo(): string {
    return "Tomo 백엔드 시작!"
  }
  getInfo(): string {
    return "tomo 백엔드 v1.0 준비 중";
  }
}
