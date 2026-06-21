import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Feed } from "src/feed/domain/feed.entity";
import { CallRoom, RoomStatus } from "src/feed/domain/call-room.entity";

class CallRoomResponseDto {
    @ApiProperty({ description: '통화방 Id' })
    readonly id!: string;

    @ApiProperty({ enum: RoomStatus, description: '통화방 상태 (OPEN, CLOSED)' })
    readonly status!: RoomStatus;

    @ApiProperty({ description: '최대 참여 인원' })
    readonly maxParticipants!: number;

    @ApiProperty({ description: '현재 참여 인원' })
    readonly currentParticipants!: number;

    private constructor(
        id: string,
        status: RoomStatus,
        maxParticipants: number,
        currentParticipants: number,
    ) {
        this.id = id;
        this.status = status;
        this.maxParticipants = maxParticipants;
        this.currentParticipants = currentParticipants;
    }

    static from(callRoom: CallRoom): CallRoomResponseDto {
        return new CallRoomResponseDto(
            callRoom.id!,
            callRoom.status,
            callRoom.maxParticipants,
            callRoom.currentParticipants,
        );
    }
}

export class FeedResponseDto {
    @ApiProperty({ description: '피드 고유 ID' })
    readonly id!: string;

    @ApiProperty({ description: '작성자 ID (익명 유저 식별자)' })
    readonly authorId!: string;

    @ApiProperty({ description: '작성자 닉네임' })
    readonly authorNickname!: string;

    @ApiProperty({ description: '작성자 고유 핸들' })
    readonly authorHandle!: string;

    @ApiProperty({ description: '피드 좋아요 갯수' })
    readonly likeCount!: number;

    @ApiProperty({ description: '작성 일시' })
    readonly createdAt!: Date;

    @ApiPropertyOptional({ description: '피드 내용 (선택)' })
    readonly content?: string | null;

    @ApiPropertyOptional({ type: CallRoomResponseDto, description: '연결된 익명 보이스 통화방 정보' })
    readonly callRoom?: CallRoomResponseDto | null;

    private constructor(
        id: string,
        authorId: string,
        authorNickname: string,
        authorHandle: string,
        likeCount: number,
        createdAt: Date,
        content?: string | null,
        callRoom?: CallRoomResponseDto | null,
    ) {
        // 4. 할당 순서도 완벽하게 일치시킴 (가독성 향상)
        this.id = id;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
        this.authorHandle = authorHandle;
        this.likeCount = likeCount;
        this.createdAt = createdAt;
        this.content = content;
        this.callRoom = callRoom;
    }

    static from(feed: Feed): FeedResponseDto {
        const callRoomDto = feed.callRoom
            ? CallRoomResponseDto.from(feed.callRoom)
            : null;

        return new FeedResponseDto(
            feed.id!,
            feed.authorId,
            feed.authorNickname,
            feed.authorHandle,
            feed.likeCount,
            feed.createdAt,
            feed.content,
            callRoomDto
        );
    }
}