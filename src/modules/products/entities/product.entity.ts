import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { Cascade, Collection, type Opt, type Rel } from '@mikro-orm/core';
import { Transform } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity.js';
import { ProductPhoto } from './product-photo.entity.js';
import { ProductsRepository } from '../products.repository.js';

export enum ProductStatus {
  AVAILABLE = 1,
  RESERVED = 2,
  SOLD = 3,
}

@Entity({ tableName: 'product', repository: () => ProductsRepository })
export class Product {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Index()
  @Property({
    type: 'Date',
    columnType: 'timestamp',
    fieldName: 'datePublished',
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  datePublished: Opt<Date> = new Date();

  @Property({ type: 'string', length: 250 })
  title!: string;

  @Property({ type: 'string', length: 2000 })
  description!: string;

  @Enum({ items: () => ProductStatus, default: ProductStatus.AVAILABLE })
  status: Opt<ProductStatus> = ProductStatus.AVAILABLE;

  @Property({ type: 'number', columnType: 'double' })
  price!: number;

  @Property({ type: 'number', fieldName: 'numVisits', default: 0 })
  numVisits: Opt<number> = 0;

  @ManyToOne({
    entity: () => Category,
    fieldName: 'idCategory',
    cascade: [Cascade.MERGE],
    index: true,
  })
  category!: Rel<Category>;

  @OneToOne({
    entity: () => ProductPhoto,
    fieldName: 'mainPhoto',
    cascade: [Cascade.MERGE],
    nullable: true,
    index: true,
    unique: true,
  })
  @Transform((p: any) => p.value && p.value.url)
  mainPhoto?: Rel<ProductPhoto>;

  @OneToMany({
    entity: () => ProductPhoto,
    mappedBy: (photo: ProductPhoto) => photo.product,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  @Transform((photos: any) =>
    photos.value?.isInitialized() ? photos.value.getItems() : null,
  )
  photos = new Collection<ProductPhoto>(this);

  constructor(
    title?: string,
    description?: string,
    price?: number,
    category?: Rel<Category>,
  ) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (price !== undefined) this.price = price;
    if (category) this.category = category;
  }

  addPhoto(photo: ProductPhoto): void {
    this.photos.add(photo);
    photo.product = this;
  }
}
