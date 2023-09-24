import {
  Cascade,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Transform, Exclude } from 'class-transformer';
import { Category } from './Category';
import { ProductPhoto } from './ProductPhoto';
import { ProductsRepository } from 'src/products/products.repository';

@Entity({ customRepository: () => ProductsRepository })
export class Product {
  @PrimaryKey()
  id!: number;

  @Index({ name: 'datePublished' })
  @Property({
    columnType: 'timestamp',
    fieldName: 'datePublished',
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  datePublished!: Date;

  @Property({ length: 250 })
  title!: string;

  @Property({ length: 2000 })
  description!: string;

  @Property()
  status = 1;

  @Property({ columnType: 'double' })
  price!: number;

  @Property({ fieldName: 'numVisits' })
  numVisits!: number;

  @ManyToOne({
    entity: () => Category,
    fieldName: 'idCategory',
    cascade: [Cascade.MERGE],
    index: 'idCategory',
  })
  category!: Category;

  @OneToOne({
    entity: () => ProductPhoto,
    fieldName: 'mainPhoto',
    cascade: [Cascade.MERGE],
    nullable: true,
    index: 'mainPhoto',
    unique: 'mainPhoto_2',
  })
  @Transform((p) => p.value && p.value.url)
  mainPhoto?: ProductPhoto;

  constructor(
    title: string,
    description: string,
    price: number,
    category: Category,
    photo: ProductPhoto,
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.category = category;
    this.mainPhoto = photo
  }
}
