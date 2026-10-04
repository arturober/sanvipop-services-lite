import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  type FilterQuery,
  QueryOrder,
  type QueryOrderMap,
} from '@mikro-orm/core';
import { Product } from './entities/product.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { ProductPhoto } from './entities/product-photo.entity.js';
import { ProductsRepository } from './products.repository.js';
import { InsertProductDto } from './dto/insert-product.dto.js';
import { EditProductDto } from './dto/edit-product.dto.js';
import { AddPhotoDto } from './dto/add-photo.dto.js';
import {
  ProductsQueryDto,
  ProductSort,
} from './dto/products-query.dto.js';
import { ImageService } from '../../common/services/image/image.service.js';

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

  private getOrderMap(sort?: ProductSort): QueryOrderMap<Product> {
    switch (sort) {
      case ProductSort.PRICE:
        return { price: QueryOrder.ASC };
      case ProductSort.VIEWS:
        return { numVisits: QueryOrder.ASC };
      case ProductSort.DATE:
      case ProductSort.DISTANCE:
      default:
        return { datePublished: QueryOrder.DESC, id: QueryOrder.DESC };
    }
  }

  async findAll(query: ProductsQueryDto = {}): Promise<Product[]> {
    const orderBy = this.getOrderMap(query.sort);

    const filter: FilterQuery<Product> = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search?.trim()) {
      filter.$or = [
        { title: { $like: `%${query.search.trim()}%` } },
        { description: { $like: `%${query.search.trim()}%` } },
      ];
    }

    return this.productRepository.find(filter, {
      populate: ['category', 'mainPhoto', 'photos'],
      orderBy,
    });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: ['category', 'mainPhoto', 'photos'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.numVisits++;
    await this.productRepository.getEntityManager().flush();
    return product;
  }

  async insert(prodDto: InsertProductDto): Promise<Product> {
    const category = await this.catRepository.findOne({ id: prodDto.category });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const photoUrl = await this.imageService.saveImage(
      'products',
      prodDto.mainPhoto,
    );
    const mainPhoto = new ProductPhoto(photoUrl);
    const product = new Product(
      prodDto.title,
      prodDto.description,
      prodDto.price,
      category,
    );

    mainPhoto.product = product;
    product.photos.add(mainPhoto);

    this.productRepository.getEntityManager().persist(product);
    await this.productRepository.getEntityManager().flush();

    product.mainPhoto = mainPhoto;
    await this.productRepository.getEntityManager().flush();

    await this.productRepository.populate(product, [
      'category',
      'mainPhoto',
      'photos',
    ]);
    return product;
  }

  async update(id: number, prodDto: EditProductDto): Promise<Product> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: ['category', 'mainPhoto', 'photos'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (prodDto.title !== undefined) product.title = prodDto.title;
    if (prodDto.description !== undefined) product.description = prodDto.description;
    if (prodDto.price !== undefined) product.price = prodDto.price;
    if (prodDto.status !== undefined) product.status = prodDto.status;

    if (prodDto.category !== undefined) {
      const category = await this.catRepository.findOne({
        id: prodDto.category,
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      product.category = category;
    }

    if (prodDto.mainPhoto !== undefined) {
      const mainPhoto = await this.prodPhotoRepository.findOne({
        id: prodDto.mainPhoto,
      });
      if (!mainPhoto || mainPhoto.product.id !== id) {
        throw new BadRequestException("It must be a product's photo");
      }
      product.mainPhoto = mainPhoto;
    }

    await this.productRepository.getEntityManager().flush();
    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: ['photos', 'mainPhoto'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const photoUrls = product.photos.getItems().map((photo) => photo.url);

    product.mainPhoto = undefined;
    await this.productRepository.getEntityManager().flush();

    this.productRepository.getEntityManager().remove(product);
    await this.productRepository.getEntityManager().flush();

    for (const url of photoUrls) {
      await this.imageService.removeImage(url);
    }
  }

  async addPhoto(
    idProd: number,
    photoDto: AddPhotoDto,
  ): Promise<ProductPhoto> {
    const product = await this.productRepository.findOne(
      { id: idProd },
      { populate: ['photos', 'mainPhoto'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const photoUrl = await this.imageService.saveImage(
      'products',
      photoDto.photo,
    );
    const photo = new ProductPhoto(photoUrl);
    photo.product = product;
    product.photos.add(photo);
    this.prodPhotoRepository.getEntityManager().persist(photo);

    if (photoDto.setMain) {
      product.mainPhoto = photo;
    }

    await this.productRepository.getEntityManager().flush();
    return photo;
  }

  async removePhoto(idProd: number, idPhoto: number): Promise<void> {
    const product = await this.productRepository.findOne(
      { id: idProd },
      { populate: ['photos', 'mainPhoto'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const photo = product.photos
      .getItems()
      .find((p) => p.id === idPhoto);
    if (!photo) {
      throw new NotFoundException('Photo not found in this product');
    }

    const photoUrl = photo.url;
    if (product.mainPhoto?.id === idPhoto) {
      const remaining = product.photos
        .getItems()
        .filter((p) => p.id !== idPhoto);
      product.mainPhoto = remaining.length > 0 ? remaining[0] : undefined;
      await this.productRepository.getEntityManager().flush();
    }

    this.prodPhotoRepository.getEntityManager().remove(photo);
    await this.prodPhotoRepository.getEntityManager().flush();
    await this.imageService.removeImage(photoUrl);
  }
}
