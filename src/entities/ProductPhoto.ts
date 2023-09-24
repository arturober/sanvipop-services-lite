import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Product } from './Product';
import { Exclude } from 'class-transformer';

@Entity()
export class ProductPhoto {

  @PrimaryKey()
  id!: number;

  @Exclude()
  @ManyToOne({ entity: () => Product, fieldName: 'idProduct', cascade: [Cascade.MERGE], index: 'idProduct' })
  product!: Product;

  @Property({ length: 250 })
  url!: string;

  constructor(url: string) {
    this.url = url;
  }
}
