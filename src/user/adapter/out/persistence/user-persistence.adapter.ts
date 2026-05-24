import { Injectable } from "@nestjs/common";
import { UserRepositoryPort } from "../../../application/ports/out/user.repository.port"
import { User } from "src/user/domain/user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { UserMapper } from "./mapper/user.mapper";

@Injectable()
export class UserPersistenceAdapter implements UserRepositoryPort {

    // PrismaService를 주입받아 실제 DB와 통신할 수 있게 합니다.
    constructor(private readonly prisma: PrismaService) { }

    async save(user: User): Promise<User> {
        const persistenceData = UserMapper.toPersistence(user);

        const savedData = await this.prisma.user.create({
            data: persistenceData,
        });

        return UserMapper.toDomain(savedData);
    }

    async findById(id: string): Promise<User | null> {
        const foundData = await this.prisma.user.findUnique({ where: { id } });
        return foundData ? UserMapper.toDomain(foundData) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const foundData = await this.prisma.user.findFirst({ where: { email } });
        return foundData ? UserMapper.toDomain(foundData) : null;
    }

    async findByProvider(provider: string, providerId: string): Promise<User | null> {
        // @@unique([provider, providerId]) 복합키 설정으로 인해 아래와 같이 검색합니다.
        const foundData = await this.prisma.user.findUnique({
            where: {
                provider_providerId: { provider, providerId }
            }
        });
        return foundData ? UserMapper.toDomain(foundData) : null;
    }

    async findByHandle(handle: string): Promise<User | null> {
        // Prisma 스키마에서 handle 필드는 @unique 이므로 findUnique를 사용합니다.
        const foundData = await this.prisma.user.findUnique({
            where: { handle },
        });
        return foundData ? UserMapper.toDomain(foundData) : null;
    }

    // 도메인 엔티티를 전달받아 실제 DB의 데이터를 수정
    async update(user: User): Promise<User> {
        const persistenceData = UserMapper.toPersistence(user);

        const updatedData = await this.prisma.user.update({
            where: { id: user.id },
            data: persistenceData,
        });

        return UserMapper.toDomain(updatedData);
    }
}