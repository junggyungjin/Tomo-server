import { Injectable } from "@nestjs/common";
import { FollowRepositoryPort } from "src/user/application/ports/out/follow.repository.port";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FollowPersistenceAdapter implements FollowRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: { followerId, followingId }
            }
        });

        // 레코드가 존재하고, deletedAt이 null일 때만 실제로 팔로우 중인 상태
        return follow !== null && follow.deletedAt === null;
    }

    async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
        // 1. 현재 팔로우 레코드 존재 여부 및 활성화 상태 선행 조회
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: { followerId, followingId }
            }
        });

        const isCurrentlyActive = existingFollow !== null && existingFollow.deletedAt === null;
        const willBeFollowed = !isCurrentlyActive; // 이번 요청으로 변경될 최종 상태

        return await this.prisma.$transaction(async (tx) => {
            // 2. 팔로우 데이터 이력(Soft Delete 포함)처리
            if (isCurrentlyActive) {
                // 이미 팔로우 중 -> 언팔로우 처리 (Soft Delete)
                await tx.follow.update({
                    where: { id: existingFollow.id },
                    data: { deletedAt: new Date() }
                });
            } else if (existingFollow) {
                // 과거 이력 존재함 -> 재팔로우 처리 (Soft Delete 해제)
                await tx.follow.update({
                    where: { id: existingFollow.id },
                    data: { deletedAt: null }
                });
            } else {
                // 최초 팔로우 -> 신규 생성
                await tx.follow.create({
                    data: { followerId, followingId }
                });
            }

            // 목표 상태에 따른 카운트 연산자 동적 결정 (중복 코드 제거)
            const countOperation = willBeFollowed ? 'increment' : 'decrement';

            // 공통 유저 카운트 단일 Out-Port 호출 처리
            await tx.user.update({
                where: { id: followerId },
                data: { followingCount: { [countOperation]: 1 } }
            });

            await tx.user.update({
                where: { id: followingId },
                data: { followerCount: { [countOperation]: 1 } }
            });

            return willBeFollowed;
        });
    }

    async getFollowCounts(userId: string): Promise<{ followerCount: number; followingCount: number; }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { followerCount: true, followingCount: true }
        });

        if (!user) return { followerCount: 0, followingCount: 0 };

        return {
            followerCount: user.followerCount,
            followingCount: user.followingCount,
        };
    }
}