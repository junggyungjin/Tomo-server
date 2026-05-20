import { IsString, IsOptional } from "class-validator";

export class SocialLoginRequestDto {
    /**
     * 클라이언트(안드로이드)에서 발급받은 OAuth 토큰(주로 JWT형태의 idToken)
     */
    @IsString()
    readonly token!: string;

    /**
     * 소셜 제공자가 발급한 고유 사용자 ID
     */
    @IsString()
    readonly providerId!: string;

    /**
     * 사용자 이메일 (선택)
     */
    @IsOptional()
    @IsString()
    readonly email?: string;

    /**
     * 사용자 이름 (선택)
     */
    @IsOptional()
    @IsString()
    readonly name?: string;
}