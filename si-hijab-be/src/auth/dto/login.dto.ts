import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  USER_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  USER_PASSWORD: string;
}
