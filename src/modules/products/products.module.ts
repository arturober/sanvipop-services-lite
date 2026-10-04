import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductPhoto } from './entities/product-photo.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { CommonModule } from '../../common/common.module.js';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, ProductPhoto, Category]),
    CommonModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
