import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  nickname!: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsString()
  @IsNotEmpty()
  nationality!: string;

  @IsOptional()
  @IsString()
  @Length(3, 30)
  handle?: string | null;
}
