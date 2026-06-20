import { ApiProperty } from "@nestjs/swagger";
import type { LikeFeedResult } from "src/feed/application/ports/in/like-feed.usecase";

export class LikeFeedResponseDto {
    @ApiProperty({
        description: '요청 처리 후의 좋아요 상태 (true: 좋아요 됨, false: 좋아요 취소됨)',
        example: true
    })
    readonly isLiked: boolean;
    @ApiProperty({
        description: '요청 처리 후의 최종 피드 좋아요 개수',
        example: 42
    })
    readonly likeCount: number;

    // 외부에서 임의로 new 키워드를 쓰지 못하도록 private 생성자 사용
    private constructor(isLiked: boolean, likeCount: number) {
        this.isLiked = isLiked;
        this.likeCount = likeCount;
    }

    // 팩토리 메서드: 실제 클래스의 인스턴스를 반환하여 NestJS 직렬화 생태계와 완벽 호환
    static from(result: LikeFeedResult): LikeFeedResponseDto {
        return new LikeFeedResponseDto(
            result.isLiked,
            result.likeCount
        );
    }
}