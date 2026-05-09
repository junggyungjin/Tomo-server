# Tomo Project Context
- Framework: NestJS
- Architecture: Hexagonal Architecture
- Database: PostgreSQL with Prisma
- Auth Strategy: 100% Social Login (Kakao, Line, Google, Apple)
- Nickname Policy: Allow duplicates (Display name), use Unique UUID or Handle for identification.
- Rules: Follow Domain-Driven Design (DDD) principles
- **Response Format Strategy**:
    1. **Explanation First**: Always provide a clear text explanation of the logic or architectural reason.
    2. **Full Code Blocks**: When providing code, always include the **Full File Path** as a comment at the top of the code block. 
       - Example: `// src/users/adapter/in/web/user.controller.ts`
    3. **Highlight Changes**: Use comments like `// UPDATED`, `// ADDED`, or `// FIXED` within the code to make changes clearly visible.
    4. **Direct Output**: Do not use "Propose" or "Suggest" mode that triggers Accept/Reject UI. Provide the code directly in the chat response.

# 30-Day Development Roadmap
## Week 1: 헥사고날 아키텍처 기초 & 유저 도메인
[x] Day 1: NestJS 프로젝트 생성 및 기본 구조 분석 (Controller/Service/Module)
[x] Day 2: PostgreSQL 설치 및 Prisma(ORM) 연동 (Database Driven Adapter 준비)
[x] Day 3: [핵심] 헥사고날 폴더 구조 설계 (Domain, Application, Adapter 폴더 세팅)
[x] Day 4: User 도메인 설계: 순수 Entity 정의 및 외부 통신을 위한 Port(인터페이스) 작성
[x] Day 5: User Persistence 어댑터 구현: Prisma를 사용한 실제 DB 저장 로직(Out-Port 구현체)
[ ] Day 6: User Web 어댑터 구현: HTTP 요청을 받는 Controller(In-Adapter)
[ ] Day 7: 의존성 주입(DI) 완성: Port와 Adapter를 NestJS Module에서 조립하기

## Week 2: 인증(Auth) 도메인 & 외부 어댑터 연동
[ ] Day 8: Auth 도메인 설계: 가입/로그인 UseCase 정의
[ ] Day 9: JWT 어댑터 구현: 토큰 발행 및 검증 로직 (In/Out-Port 분리)
[ ] Day 10: [외부 연동] 소셜 로그인 어댑터 1: Google/Apple OAuth2 (In-Adapter)
[ ] Day 11: [외부 연동] 소셜 로그인 어댑터 2: Kakao/Line (지역 특화 어댑터)
[ ] Day 12: 이메일 어댑터 구현: Nodemailer를 활용한 Driven Adapter 제작
[ ] Day 13: 도메인 간 통신 설계: User와 Auth 도메인의 의존성 역전(DIP) 처리
[ ] Day 14: API 명세서(Swagger) 자동화: 헥사고날 구조에서의 문서화 세팅

## Week 3: 비즈니스 고도화 (모임 & 실시간 채팅)
[ ] Day 15: Group(모임) 도메인 설계: 모임 생성, 참여 규칙(Domain Logic) 작성
[ ] Day 16: N:M 관계 처리: 모임 참여자 관리를 위한 Persistence 어댑터 고도화
[ ] Day 17: [실시간 어댑터] Socket.io 세팅 및 채팅용 In-Adapter 입구 만들기
[ ] Day 18: 채팅 메시지 도메인 설계 및 실시간 브로드캐스팅 로직 구현
[ ] Day 19: 채팅 내역 저장 어댑터: PostgreSQL 기반 메시지 아카이브 로직
[ ] Day 20: 도메인 이벤트(Domain Events): 모임 수락 시 채팅방 자동 생성 로직
[ ] Day 21: 트랜잭션(Transaction) 처리: 헥사고날 구조에서 데이터 일관성 유지하기

## Week 4: 인프라 어댑터 & 실전 배포
[ ] Day 22: 파일 업로드 어댑터: AWS S3 연동 Driven Adapter 구현
[ ] Day 23: 프로필/모임 이미지 도메인 연동 및 썸네일 처리
[ ] Day 24: 환경 설정 어댑터: .env 환경 변수 관리 및 도메인 주입
[ ] Day 25: 클라우드 배포 1: 인프라 어댑터 환경(Railway/Supabase) 세팅
[ ] Day 26: 클라우드 배포 2: 실제 서버 배포 및 도메인 연결
[ ] Day 27: [연동] 안드로이드 Retrofit - NestJS API 최종 통신 테스트 (CORS 해결)
[ ] Day 28: [연동] 안드로이드 Socket.io - NestJS 소켓 최종 연동 테스트
[ ] Day 29: 로깅 및 모니터링 어댑터 도입 (Winston, Exception Filters)
[ ] Day 30: 30일 회고 및 헥사고날 구조 리팩토링 (코드 정리)

## Client Stack & Communication
- **Primary Client**: Android (Mobile)
- **Language/Framework**: Kotlin / Jetpack Compose
- **Network Library**: Retrofit2 (REST API), Socket.io-client (Real-time)
- **Authentication Flow**: 
  1. Social SDK Login (Android side) -> Get Provider Token
  2. Send Token to NestJS Server -> Receive JWT (Access/Refresh)
  3. All subsequent API calls use JWT in the Authorization Header
- **Server Address (Local)**: http://10.0.2.2:3000 (Android Emulator access point)