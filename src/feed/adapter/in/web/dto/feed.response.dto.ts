import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Feed } from "src/feed/domain/feed.entity";
import { RoomStatus } from "src/feed/domain/call-room.entity";

class CallRoomResponseDto {
    @ApiProperty({ description: '통화방 Id' })
    id!: string;

    @ApiProperty({ enum: RoomStatus, description: '통화방 상태 (OPEN, CLOSED)' })
    status!: RoomStatus;

    @ApiProperty({ description: '최대 참여 인원' })
    maxParticipants!: number;

    @ApiProperty({ description: '현재 참여 인원' })
    currentParticipants!: number;
}

export class FeedResponseDto {
    @ApiProperty({ description: '피드 고유 ID' })
    id!: string;

    @ApiPropertyOptional({ description: '피드 내용 (선택)' })
    content?: string | null;

    @ApiProperty({ description: '작성자 ID (익명 유저 식별자)' })
    authorId!: string;

    @ApiProperty({ description: '작성자 닉네임' })
    authorNickname!: string;

    @ApiProperty({ description: '작성자 고유 핸들' })
    authorHandle!: string;

    @ApiPropertyOptional({ type: CallRoomResponseDto, description: '연결된 익명 보이스 통화방 정보' })
    callRoom?: CallRoomResponseDto | null;

    @ApiProperty({ description: '작성 일시' })
    createdAt!: Date;

    static from(feed: Feed): FeedResponseDto {
        return {
            id: feed.id!,
            content: feed.content,
            authorId: feed.authorId,
            authorNickname: feed.authorNickname,
            authorHandle: feed.authorHandle,
            callRoom: feed.callRoom ? {
                id: feed.callRoom.id!,
                status: feed.callRoom.status,
                maxParticipants: feed.callRoom.maxParticipants,
                currentParticipants: feed.callRoom.currentParticipants,
            } : null,
            createdAt: feed.createdAt,
        };
    }
}