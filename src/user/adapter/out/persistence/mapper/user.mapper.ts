import { User as PrismaUser } from '@prisma/client';
import { User, UserStatus } from 'src/user/domain/user.entity';

export class UserMapper {
    /**
     * DB(Prisma)에서 꺼낸 데이터를 순수 Domain 객체로 변환
     * 안드로이드에서 Room Entity를 UI Model로 변환하는것과 같다
     */
    static toDomain(prismaUser: PrismaUser): User {
        return new User(
            prismaUser.id,
            prismaUser.provider,
            prismaUser.providerId,
            prismaUser.email,
            prismaUser.nickname,
            prismaUser.handle,
            prismaUser.nationality,
            prismaUser.gender,
            prismaUser.profileImageUrl,
            prismaUser.status as UserStatus,
            prismaUser.createdAt,
            prismaUser.introduction,
            prismaUser.coverImageUrl,
            prismaUser.followerCount,
            prismaUser.followingCount,
            prismaUser.postCount
        );
    }

    /**
     * Domain 객체를 DB(Prisma)에 저장하기 좋은 형태로 변환합니다.
     */
    static toPersistence(user: User) {
        return {
            id: user.id,
            provider: user.provider,
            providerId: user.providerId,
            email: user.email,
            nickname: user.nickname,
            handle: user.handle,
            nationality: user.nationality,
            gender: user.gender,
            profileImageUrl: user.profileImageUrl,
            status: user.status,
            createdAt: user.createdAt,
            introduction: user.introduction,
            coverImageUrl: user.coverImageUrl,
            followerCount: user.followerCount,
            followingCount: user.followingCount,
            postCount: user.postCount,
        };
    }
}