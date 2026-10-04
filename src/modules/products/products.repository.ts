import { EntityRepository } from '@mikro-orm/sql';
import { Product } from './entities/product.entity.js';

export class ProductsRepository extends EntityRepository<Product> {}