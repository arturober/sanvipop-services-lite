import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/entities/Category';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly catService: CategoriesService) {}

    @Get()
    async getAllCategories(): Promise<{categories: Category[]}> {
        return {categories: await this.catService.findAll()};
    }
}
