/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserIdService } from '../common/utils/user-id.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserIdService],
})
export class UsersModule {}
