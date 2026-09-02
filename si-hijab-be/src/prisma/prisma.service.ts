/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // console.log('DB HOST:', process.env.DATABASE_HOST);
    // console.log('DB PORT:', process.env.DATABASE_PORT);
    // console.log('DB USER:', process.env.DATABASE_USER);
    // console.log('DB PASSWORD EXISTS:', !!process.env.DATABASE_PASSWORD);
    // console.log('DB NAME:', process.env.DATABASE_NAME);

    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 5,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
