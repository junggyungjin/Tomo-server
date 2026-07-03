import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "src/user/domain/user.entity";

export class UpdateUserProfileResponseDto {
    @ApiProperty({ description: '유저 ID (UUID)' })
    readonly id!: string;
    @ApiProperty({ description: '유저 닉네임' })
    readonly nickname!: string;
    @ApiProperty({ description: '유저 핸들 (고유값)' })
    readonly handle!: string;
    @ApiProperty({ description: '국적 (ISO 국가 코드)' })
    readonly nationality!: string;
    @ApiProperty({ description: '유저 상태', example: 'ACTIVE' })
    readonly status!: string;
    @ApiProperty({ description: '팔로워 수', default: 0 })
    readonly followerCount!: number;
    @ApiProperty({ description: '팔로잉 수', default: 0 })
    readonly followingCount!: number;
    @ApiProperty({ description: '게시글 수', default: 0 })
    readonly postCount!: number;
    @ApiPropertyOptional({ description: '유저 소개글' })
    readonly introduction?: string | null;
    @ApiPropertyOptional({ description: '프로필 이미지 URL' })
    readonly profileImageUrl?: string | null;
    @ApiPropertyOptional({ description: '커버 이미지 URL' })
    readonly coverImageUrl?: string | null;
    private constructor(
        id: string,
        nickname: string,
        handle: string,
        nationality: string,
        status: string,
        followerCount: number,
        followingCount: number,
        postCount: number,
        introduction?: string | null,
        profileImageUrl?: string | null,
        coverImageUrl?: string | null,
    ) {
        this.id = id;
        this.nickname = nickname;
        this.handle = handle;
        this.nationality = nationality;
        this.status = status;
        this.followerCount = followerCount;
        this.followingCount = followingCount;
        this.postCount = postCount;
        this.introduction = introduction;
        this.profileImageUrl = profileImageUrl;
        this.coverImageUrl = coverImageUrl;
    }
    static from(user: User): UpdateUserProfileResponseDto {
        return new UpdateUserProfileResponseDto(
            user.id,
            user.nickname || '', // Kotlin Non-null 대응
            user.handle,
            user.nationality || '', // Kotlin Non-null 대응
            user.status,
            user.followerCount,
            user.followingCount,
            user.postCount,
            user.introduction,
            user.profileImageUrl,
            user.coverImageUrl,
        );
    }
}