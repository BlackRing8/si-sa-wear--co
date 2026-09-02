/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  USER_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  USER_PASSWORD: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  USER_NAME?: string;

  @IsOptional()
  @IsString()
  USER_PHONENUMBER?: string;
}
