import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFeedRequestDto {

    @ApiPropertyOptional({ description: '피드 내용 (선택)', example: '오늘 날씨가 정말 좋네요!' })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ description: '통화방(callRoom) 생성 여부', example: true })
    @IsBoolean()
    hasCallRoom!: boolean;
}