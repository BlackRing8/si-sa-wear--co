/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit 

*/

import { Controller, Body, Param, Get, Post, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard) // protect endpoint sementara ini dengan JWT authentication
  @Post()
  create(@Body() dto: CreateProductsDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
