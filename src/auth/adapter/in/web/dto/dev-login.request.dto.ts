import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DevLoginRequestDto {
    /**
     * 개발/테스트 목적의 고유 식별자
     */
    @ApiProperty({
        description: '테스트용 고유 ID (원하는 아무 문자열이나 입력 가능합니다)',
        example: 'dev-tester-1'
    })
    @IsString()
    @IsNotEmpty()
    readonly providerId!: string;
}