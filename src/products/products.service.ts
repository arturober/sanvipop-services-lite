import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ImageService } from 'src/commons/image/image.service';
import { Category } from 'src/entities/Category';
import { Product } from 'src/entities/Product';
import { ProductPhoto } from 'src/entities/ProductPhoto';
import { EditProductDto } from './dto/edit-product.dto';
import { InsertProductDto } from './dto/insert-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductsRepository,
    @InjectRepository(ProductPhoto)
    private readonly prodPhotoRepository: EntityRepository<ProductPhoto>,
    @InjectRepository(Category)
    private readonly catRepository: EntityRepository<Category>,
    private readonly imageService: ImageService,
  ) {}

  private async getAndCheckProduct(
    id: number,
    relations: (keyof Product)[] = [],
  ): Promise<Product> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: relations },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll({populate: ['category', 'mainPhoto']});
  }

  findById(id: number): Promise<Product> {
    return this.getAndCheckProduct(id, ['category', 'mainPhoto']);
  }

  async insert(prodDto: InsertProductDto): Promise<Product> {
    const photoUrl = await this.imageService.saveImage(
      'products',
      prodDto.mainPhoto,
    );
    const category = await this.catRepository.findOne(prodDto.category);
    if(!category) {
      throw new NotFoundException('Category not found');
    }
    const mainPhoto = new ProductPhoto(photoUrl);
    const product = new Product(
      prodDto.title,
      prodDto.description,
      prodDto.price,
      category,
      mainPhoto,
    );
    mainPhoto.product = product;
    await this.productRepository.getEntityManager().persistAndFlush(product);
    return product;
  }

  async update(
    id: number,
    prodDto: EditProductDto,
  ): Promise<Product> {
    const product = await this.getAndCheckProduct(id, [
      'mainPhoto',
      'category',
    ]);
    if (prodDto.title) product.title = prodDto.title;
    if (prodDto.description) product.description = prodDto.description;
    if (prodDto.price) product.price = prodDto.price;
    if (prodDto.category) {
      product.category = await this.catRepository.findOne(prodDto.category);
      if (!product.category) {
        throw new BadRequestException('Category not found');
      }
    }
    if (prodDto.mainPhoto) {
      product.mainPhoto = await this.prodPhotoRepository.findOne(
        prodDto.mainPhoto,
      );
      if (!product.mainPhoto || product.mainPhoto.product.id !== id) {
        throw new BadRequestException("It must be a product's photo");
      }
    }
    this.productRepository.getEntityManager().flush();
    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.getAndCheckProduct(id);
    await this.productRepository.getEntityManager().removeAndFlush(product); // TODO: Usuario logueado
  }
}
