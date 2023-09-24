import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from 'src/entities/Category';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Category])
  ],
  providers: [CategoriesService],
  exports: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
