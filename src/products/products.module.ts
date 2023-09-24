import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommonsModule } from 'src/commons/commons.module';
import { Category } from 'src/entities/Category';
import { Product } from 'src/entities/Product';
import { ProductPhoto } from 'src/entities/ProductPhoto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, ProductPhoto, Category]),
    CommonsModule
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
