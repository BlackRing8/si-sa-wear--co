/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { Injectable, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from './dto/create-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductsDto) {
    const existingProduct = await this.prisma.pRODUCT_MASTER.findUnique({
      where: { PRODUCT_SLUG: dto.PRODUCT_SLUG },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Produk dengan slug yang sama sudah tersedia.',
      );
    }

    return this.prisma.pRODUCT_MASTER.create({
      data: {
        PRODUCT_NAME: dto.PRODUCT_NAME,
        PRODUCT_SLUG: dto.PRODUCT_SLUG,
        PRODUCT_DESC: dto.PRODUCT_DESC,
        PRODUCT_STATUS: 1,
      },
    });
  }

  async findAll() {
    return this.prisma.pRODUCT_MASTER.findMany({
      where: { PRODUCT_STATUS: 1 },
      include: {
        VARIANTS: {
          select: {
            SIZE: true,
            COLOR: true,
            INVENTORY: true,
          },
        },

        IMAGES: true,
        CATEGORIES: {
          include: {
            CATEGORY: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.pRODUCT_MASTER.findUnique({
      where: {
        PRODUCT_SLUG: slug,
      },
      include: {
        VARIANTS: {
          include: {
            SIZE: true,
            COLOR: true,
            INVENTORY: true,
          },
        },
        IMAGES: true,
        CATEGORIES: {
          include: {
            CATEGORY: true,
          },
        },
      },
    });
  }
}
