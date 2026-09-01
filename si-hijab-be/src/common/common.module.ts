import { Module } from '@nestjs/common';
import { UserIdService } from './utils/user-id.service';

@Module({
  providers: [UserIdService],
  exports: [UserIdService],
})
export class CommonModule {}
