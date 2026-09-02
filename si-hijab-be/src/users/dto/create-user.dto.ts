/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(25)
  @IsString()
  USER_ID: string;

  @IsEmail()
  USER_EMAIL: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  USER_NAME?: string;

  @IsString()
  @IsNotEmpty()
  USER_PASSWORD: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  USER_PHONENUMBER?: string;
}
