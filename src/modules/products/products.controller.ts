import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  Delete,
  HttpCode,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { ProductsService } from './products.service.js';
import { InsertProductDto } from './dto/insert-product.dto.js';
import { EditProductDto } from './dto/edit-product.dto.js';
import { AddPhotoDto } from './dto/add-photo.dto.js';
import { ProductsQueryDto } from './dto/products-query.dto.js';
import {
  PaginatedProductsResponseDto,
  SingleProductResponseDto,
  PhotoUploadResponseDto,
} from './dto/product-response.dto.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get available products with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'List of products with pagination info' })
  async getAllProducts(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ProductsQueryDto,
    @Req() req?: Request,
  ): Promise<PaginatedProductsResponseDto> {
    const result = await this.productsService.findAll(query);
    return PaginatedProductsResponseDto.from(result, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(
    @Param('id', ParseIntPipe) prodId: number,
    @Req() req?: Request,
  ): Promise<SingleProductResponseDto> {
    const product = await this.productsService.findById(prodId);
    return SingleProductResponseDto.from(product, req);
  }

  @Post()
  @ApiOperation({ summary: 'Publish a new product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async insertProduct(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    prodDto: InsertProductDto,
    @Req() req?: Request,
  ): Promise<SingleProductResponseDto> {
    const product = await this.productsService.insert(prodDto);
    return SingleProductResponseDto.from(product, req);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit an existing product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id', ParseIntPipe) prodId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    prodDto: EditProductDto,
    @Req() req?: Request,
  ): Promise<SingleProductResponseDto> {
    const product = await this.productsService.update(prodId, prodDto);
    return SingleProductResponseDto.from(product, req);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(
    @Param('id', ParseIntPipe) prodId: number,
  ): Promise<void> {
    await this.productsService.delete(prodId);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Add a photo to a product' })
  @ApiResponse({ status: 201, description: 'Photo added' })
  async addPhoto(
    @Param('id', ParseIntPipe) prodId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    photoDto: AddPhotoDto,
    @Req() req?: Request,
  ): Promise<PhotoUploadResponseDto> {
    const photo = await this.productsService.addPhoto(prodId, photoDto);
    return PhotoUploadResponseDto.from(photo, req);
  }

  @Delete(':idProd/photos/:idPhoto')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a photo from a product' })
  @ApiResponse({ status: 204, description: 'Photo deleted' })
  async deletePhoto(
    @Param('idProd', ParseIntPipe) prodId: number,
    @Param('idPhoto', ParseIntPipe) photoId: number,
  ): Promise<void> {
    await this.productsService.removePhoto(prodId, photoId);
  }
}
