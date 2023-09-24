import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from './Product';
import { Exclude } from 'class-transformer';

@Entity()
export class Category {

  @PrimaryKey({type: 'tinyInt'})
  id!: number;

  @Property({ length: 200 })
  name!: string;

  @OneToMany(() => Product, product => product.category)
  @Exclude()
  products = new Collection<Product>(this);
}
