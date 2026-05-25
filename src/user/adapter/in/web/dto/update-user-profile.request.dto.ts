import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserProfileRequestDto {
    @ApiProperty({ description: '수정할 사용자의 ID (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ description: '변경할 닉네임', example: 'NewTomo', minLength: 2, maxLength: 20 })
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    nickname!: string;

    @ApiProperty({ description: '변경할 국적', example: 'US' })
    @IsString()
    @IsNotEmpty()
    nationality!: string;

    // IsOptional()이 붙는 선택적 필드는 느낌표(!) 대신 물음표(?) 사용
    @ApiPropertyOptional({ description: '성별', example: 'MALE' })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiPropertyOptional({ description: '프로필 이미지 URL', example: 'https://example.com/profile.jpg' })
    @IsOptional()
    @IsString()
    profileImageUrl?: string;
}