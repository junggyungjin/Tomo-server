import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LogoutRequestDto {
    /**
     * 폐기할 리프레시 토큰
     */
    @ApiProperty({
        description: '로그아웃할 기기의 리프레시 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    @IsString()
    @IsNotEmpty()
    readonly refreshToken: string;
}