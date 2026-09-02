/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  USER_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  USER_PASSWORD: string;
}
