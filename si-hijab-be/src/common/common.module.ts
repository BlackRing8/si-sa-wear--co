/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Module } from '@nestjs/common';
import { UserIdService } from './utils/user-id.service';

@Module({
  providers: [UserIdService],
  exports: [UserIdService],
})
export class CommonModule {}
