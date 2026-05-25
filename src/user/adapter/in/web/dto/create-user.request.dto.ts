import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({ description: '소셜 로그인 제공자', example: 'google' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ description: '소셜 로그인 제공자가 발급한 고유 식별자', example: '10239412948124' })
  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @ApiProperty({ description: '사용자 표시 이름 (중복 허용)', example: 'TomoUser', minLength: 2, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  nickname!: string;

  @ApiPropertyOptional({ description: '사용자 이메일 주소', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ description: '사용자 국적 (ISO 국가 코드 등)', example: 'KR' })
  @IsString()
  @IsNotEmpty()
  nationality!: string;

  @ApiPropertyOptional({ description: '사용자 고유 핸들 (앱 내 고유 ID)', example: '@tomouser', minLength: 3, maxLength: 30 })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  handle?: string | null;
}
