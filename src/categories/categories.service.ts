import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/Category';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private readonly catRepository: EntityRepository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.catRepository.findAll();
    }

    async findById(id: number): Promise<Category> {
        return this.catRepository.findOneOrFail({id});
    }
}
