import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SocialLoginRequestDto {
    /**
     * 클라이언트(안드로이드)에서 발급받은 OAuth 토큰(주로 JWT형태의 idToken)
     */
    @ApiProperty({ description: '클라이언트에서 발급받은 OAuth 토큰 (idToken 등)', example: 'eyJhbGciOiJSUzI1NiIs...' })
    @IsString()
    @IsNotEmpty()
    readonly token!: string;

    /**
     * 소셜 제공자가 발급한 고유 사용자 ID
     */
    @ApiProperty({ description: '소셜 제공자가 발급한 고유 사용자 ID', example: '1092837198237' })
    @IsString()
    @IsNotEmpty()
    readonly providerId!: string;

    /**
     * 사용자 이메일 (선택)
     */
    @ApiPropertyOptional({ description: '사용자 이메일 (선택)', example: 'user@example.com' })
    @IsOptional()
    @IsString()
    readonly email?: string;

    /**
     * 사용자 이름 (선택)
     */
    @ApiPropertyOptional({ description: '사용자 이름 (선택)', example: 'TomoUser' })
    @IsOptional()
    @IsString()
    readonly name?: string;
}