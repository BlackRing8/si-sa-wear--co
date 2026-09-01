import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UserIdService } from '../common/utils/user-id.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userIdService: UserIdService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.uSER_MASTER.findUnique({
      where: {
        USER_EMAIL: dto.USER_EMAIL,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.USER_PASSWORD, 12);

    const userId = this.userIdService.generateUserId();

    try {
      const user = await this.prisma.uSER_MASTER.create({
        data: {
          USER_ID: userId,
          USER_EMAIL: dto.USER_EMAIL,
          USER_PASSWORD: hashedPassword,
          USER_NAME: dto.USER_NAME,
          USER_PHONENUMBER: dto.USER_PHONENUMBER,
          USER_STATUS: 0,
          USER_POINT: 0,
        },
      });

      return {
        message: 'Registrasi berhasil',
        data: {
          USER_ID: user.USER_ID,
          USER_EMAIL: user.USER_EMAIL,
          USER_NAME: user.USER_NAME,
          USER_PHONENUMBER: user.USER_PHONENUMBER,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[];

        if (target?.includes('USER_EMAIL')) {
          throw new ConflictException('Email sudah terdaftar');
        }

        if (target?.includes('USER_ID')) {
          throw new ConflictException('User ID sudah digunakan');
        }

        if (target?.includes('USER_PHONENUMBER')) {
          throw new ConflictException('Nomor telepon sudah terdaftar');
        }
        console.log('Conflict error:', target);
        throw new ConflictException('Data user sudah terdaftar');
      }

      throw new InternalServerErrorException('Terjadi kesalahan pada server');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.uSER_MASTER.findUnique({
      where: { USER_EMAIL: dto.USER_EMAIL },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.USER_PASSWORD,
      user.USER_PASSWORD,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const token = this.jwtService.sign({ USER_ID: user.USER_ID });

    return {
      message: 'Login berhasil',
      data: {
        USER_ID: user.USER_ID,
        USER_EMAIL: user.USER_EMAIL,
        USER_NAME: user.USER_NAME,
        USER_PHONENUMBER: user.USER_PHONENUMBER,
        ACCESS_TOKEN: token,
      },
    };
  }
}
