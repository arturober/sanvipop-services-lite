import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common';
import { Product } from 'src/entities/Product';
import { EditProductDto } from './dto/edit-product.dto';
import { InsertProductDto } from './dto/insert-product.dto';
import { ProductListResponseInterceptor } from './interceptors/product-list-response.interceptor';
import { ProductResponseInterceptor } from './interceptors/product-response.interceptor';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(ProductListResponseInterceptor, ClassSerializerInterceptor)
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ProductResponseInterceptor, ClassSerializerInterceptor)
  async getProduct(
    @Param('id', ParseIntPipe) prodId: number,
  ): Promise<Product> {
    const resp = await this.productsService.findById(prodId);
    return resp;
  }

  @Post()
  @UseInterceptors(ProductResponseInterceptor, ClassSerializerInterceptor)
  async insertProduct(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    prodDto: InsertProductDto,
  ): Promise<Product> {
    return this.productsService.insert(prodDto);
  }

  @Put(':id')
  @UseInterceptors(ProductResponseInterceptor, ClassSerializerInterceptor)
  async updateProduct(
    @Param('id', ParseIntPipe) prodId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    prodDto: EditProductDto,
  ): Promise<Product> {
    return this.productsService.update(prodId, prodDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(
    @Param('id', ParseIntPipe) prodId: number,
  ): Promise<void> {
    await this.productsService.delete(prodId);
  }
}
