/* Tanggal|Ver|dev|desc

31-08-26 | 1.0.0 | Gilang | Initial commit 

*/

import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UserIdService {
  private readonly nanoid = customAlphabet('0123456789', 10);

  generateUserId(): string {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);

    return `USR${day}${month}${year}${this.nanoid()}`;
  }
}
