import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; // 설치한 pg 사용
import { PrismaPg } from '@prisma/adapter-pg'; // 설치한 어댑터 사용

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. .env에 있는 DATABASE_URL로 DB 연결 풀 생성
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // 2. Prisma 7 전용 드라이버 어댑터 설정
    const adapter = new PrismaPg(pool);

    // 3. 부모 클래스(PrismaClient)에 어댑터 주입
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
