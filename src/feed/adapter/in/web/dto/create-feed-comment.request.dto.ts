import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateFeedCommandRequestDto {
    @ApiProperty({ description: '댓글 내용', example: '정맛 멋진 피드네요!' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @IsNotEmpty({ message: '댓글 내용은 비어있을 수 없습니다.' })
    @MaxLength(500, { message: '댓글은 최대 500자까지 입력 가능합니다.' })
    content!: string;

    @ApiPropertyOptional({ description: '대댓글인 경우 부모 댓글의 ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID('all', { message: '유효하지 않은 부모 댓글 ID 규격입니다.' })
    parentId?: string;
}