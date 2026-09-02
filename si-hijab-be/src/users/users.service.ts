/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Injectable, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.uSER_MASTER.findUnique({
      where: { USER_ID: dto.USER_ID },
    });

    if (existingUser) {
      throw new ConflictException('USER_ID sudah digunakan');
    }

    return this.prisma.uSER_MASTER.create({
      data: {
        USER_ID: dto.USER_ID,
        USER_EMAIL: dto.USER_EMAIL,
        USER_NAME: dto.USER_NAME,
        USER_PASSWORD: dto.USER_PASSWORD,
        USER_PHONENUMBER: dto.USER_PHONENUMBER,
        USER_STATUS: 0,
        USER_POINT: 0,
      },
    });
  }
}
