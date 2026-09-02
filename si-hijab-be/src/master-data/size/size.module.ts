/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Module } from '@nestjs/common';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';

@Module({
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}
