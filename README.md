# Tomo (토모) - Server

> **"눈치안볼래 재미있게 놀래"**
>
> Tomo Server는 최신 Node.js 기술 스택과 엄격한 **헥사고날 아키텍처(Hexagonal Architecture)** 및 **DDD(Domain-Driven Design)** 원칙을 준수하여 설계된 소셜 네트워킹 플랫폼의 백엔드 시스템입니다. 비즈니스 로직의 순수성을 보장하고 유지보수성을 극대화하기 위해 **Ports and Adapters** 패턴을 채택하였습니다.

---

## Key Highlights

- **Modern Tech Stack**: NestJS, TypeScript, PostgreSQL, Prisma, Socket.io.
- **Architecture**: Hexagonal Architecture (Ports and Adapters) + Domain-Driven Design (DDD).
- **Engineering Excellence**:
    - DTO의 불변성(`readonly`) 및 팩토리 메서드(`static from`)를 통한 객체 생성 제어.
    - 비즈니스 로직 유실 방지를 위한 단일 책임 원칙(SRP) 기반의 UseCase / Service 분리.
    - `ApiResponse` 래퍼와 Swagger 데코레이터를 활용한 API 응답 및 명세 표준화.

---

## Tech Stack & Libraries

| Category | Technology |
| --- | --- |
| **Language** | TypeScript |
| **Framework** | NestJS |
| **Architecture** | Hexagonal Architecture, Domain-Driven Design (DDD) |
| **Database / ORM** | PostgreSQL, Prisma |
| **Authentication** | JWT, Social OAuth2 (Kakao, Line, Google, Apple) |
| **Real-time** | Socket.io |
| **Documentation** | Swagger (`@nestjs/swagger`) |

---

## Architecture & Module Strategy

Tomo Server는 프레임워크나 외부 기술(DB 등)에 비즈니스 로직이 종속되지 않도록 계층 간 결합도를 낮추고 도메인을 격리했습니다.

### Folder Structure (Ports and Adapters)
- **`domain/`**: 외부 의존성이 전혀 없는 순수한 비즈니스 규칙과 도메인 엔티티. 
- **`application/`**:
    - `ports/in/`: 클라이언트(Web/Socket)가 비즈니스 로직을 호출하기 위한 인터페이스 (UseCase).
    - `ports/out/`: 비즈니스 로직이 외부 시스템(DB, API)과 통신하기 위한 인터페이스.
    - `services/`: In-Port(UseCase)를 구현하며, 도메인 객체를 조율하는 실제 비즈니스 로직 캡슐화.
- **`adapter/`**:
    - `in/web/`: HTTP 요청을 받아 UseCase로 전달하는 Controller 계층.
    - `out/persistence/`: Out-Port를 구현하여 Prisma 등을 통해 실제 DB와 데이터를 주고받는 계층.

---

## Engineering Standards (핵심 설계 원칙)

### 1. DTO & Validation Strictness
- **Definite Assignment & Optional**: 필수 필드는 명시적 할당(`!:`), 선택 필드는 Optional(`?:`)과 `@IsOptional()`을 강제하여 타입 안전성을 확보합니다.
- **Immutability (불변성)**: 외부에서의 임의 조작을 막기 위해 DTO 내부에 `private constructor`를 사용하고, 도메인 변환 시에는 오직 `static from(result)` 팩토리 메서드만 사용합니다. 서브 DTO에도 동일하게 적용됩니다.

### 2. Service & UseCase (SRP & DRY)
- **SRP 준수**: 기능별로 UseCase 인터페이스(In-Port)와 Service 구현체를 독립된 파일(예: `like-feed.usecase.ts` / `like-feed.service.ts`)로 분리합니다.
- **상태 기반 로직**: 비즈니스 로직 작성 시 조건 분기를 최소화(DRY)하고, 목표 상태를 도출한 후 단일 Out-Port 호출로 처리합니다.

### 3. Domain Entity Isolation
- **Projection Data 분리**: `viewerId` 등 조회 컨텍스트에 따라 달라지는 동적 데이터(`isLiked` 등)는 도메인 내부 상태를 변경하는 `setter`를 제공하지 않습니다.
- **Readonly 강제**: DB에서 조회될 때 단 한 번만 주입됨을 보장하기 위해, 위와 같은 컨텍스트 데이터는 `readonly` 키워드를 엄격하게 적용하여 휴먼 에러를 방지합니다.

### 4. Standardized API Response
- 모든 Controller의 반환값은 순수 데이터가 아닌, 커스텀 규격인 `ApiResponse` DTO로 감싸서 응답합니다. (예: `return ApiResponse.OK(data);`)
- `@CurrentUser()` 데코레이터를 통해 통일된 페이로드(`{ userId: string }`) 규격을 사용합니다.

---

## How to Run

1. **Prerequisites**
    - Node.js (v18 이상 권장)
    - PostgreSQL
    - Android Emulator (클라이언트 연동 테스트 시)

2. **Environment Setup**
    - 프로젝트 루트에 `.env` 파일을 생성하고 DB 연결 정보 및 JWT 시크릿 등을 설정합니다.

3. **Running the Server**
    ```bash
    # Install dependencies
    $ npm install

    # Prisma Client generate
    $ npx prisma generate

    # Start local development server
    $ npm run start:dev
    ```
    - 로컬 API 서버 주소: `http://localhost:3000` (Swagger API Docs 제공)
    - 안드로이드 에뮬레이터 접속용 주소: `http://10.0.2.2:3000`
