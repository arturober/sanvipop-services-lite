import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { ProductsQueryDto, ProductSort } from './dto/products-query.dto.js';
import { InsertProductDto } from './dto/insert-product.dto.js';
import { EditProductDto } from './dto/edit-product.dto.js';
import { AddPhotoDto } from './dto/add-photo.dto.js';

describe('Products Controller', () => {
  let controller: ProductsController;
  let productsServiceMock: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    addPhoto: ReturnType<typeof vi.fn>;
    removePhoto: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    productsServiceMock = {
      findAll: vi.fn().mockResolvedValue({
        products: [],
        page: 2,
        total_pages: 1,
        total_products: 5,
      }),
      findById: vi.fn().mockResolvedValue({
        id: 1,
        title: 'Product 1',
        description: 'Description 1',
        price: 100,
        status: 1,
        datePublished: new Date(),
        numVisits: 5,
        category: { id: 1, name: 'Informática' },
        photos: [],
      }),
      insert: vi.fn().mockResolvedValue({
        id: 10,
        title: 'New Product',
        description: 'New Description',
        price: 200,
        status: 1,
        datePublished: new Date(),
        numVisits: 0,
        category: { id: 2, name: 'Telefonía' },
        photos: [],
      }),
      update: vi.fn().mockResolvedValue({
        id: 1,
        title: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        status: 1,
        datePublished: new Date(),
        numVisits: 5,
        category: { id: 1, name: 'Informática' },
        photos: [],
      }),
      delete: vi.fn().mockResolvedValue(undefined),
      addPhoto: vi.fn().mockResolvedValue({
        id: 99,
        url: 'img/products/test.jpg',
      }),
      removePhoto: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
        {
          provide: ConfigService,
          useValue: { get: () => '' },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllProducts should call productsService.findAll with query and return paginated DTO', async () => {
    const query: ProductsQueryDto = {
      page: 2,
      sort: ProductSort.PRICE,
      search: 'bici',
    };

    const result = await controller.getAllProducts(query);

    expect(productsServiceMock.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual({
      products: [],
      page: 2,
      total_pages: 1,
      total_products: 5,
    });
  });

  it('getProduct should call productsService.findById with id and return single product DTO', async () => {
    const result = await controller.getProduct(1);

    expect(productsServiceMock.findById).toHaveBeenCalledWith(1);
    expect(result.product.id).toBe(1);
  });

  it('insertProduct should call productsService.insert and return created product DTO', async () => {
    const dto: InsertProductDto = {
      title: 'New Product',
      description: 'New Description',
      price: 200,
      category: 2,
      mainPhoto: 'data:image/jpeg;base64,abc',
    };

    const result = await controller.insertProduct(dto);

    expect(productsServiceMock.insert).toHaveBeenCalledWith(dto);
    expect(result.product.id).toBe(10);
  });

  it('updateProduct should call productsService.update with id and dto', async () => {
    const dto: EditProductDto = {
      title: 'Updated Product',
      price: 150,
    };

    const result = await controller.updateProduct(1, dto);

    expect(productsServiceMock.update).toHaveBeenCalledWith(1, dto);
    expect(result.product.title).toBe('Updated Product');
  });

  it('deleteProduct should call productsService.delete with id', async () => {
    await controller.deleteProduct(1);

    expect(productsServiceMock.delete).toHaveBeenCalledWith(1);
  });

  it('addPhoto should call productsService.addPhoto with id and photoDto', async () => {
    const photoDto: AddPhotoDto = {
      photo: 'data:image/jpeg;base64,xyz',
      setMain: true,
    };

    const result = await controller.addPhoto(1, photoDto);

    expect(productsServiceMock.addPhoto).toHaveBeenCalledWith(1, photoDto);
    expect(result.photo.id).toBe(99);
  });

  it('deletePhoto should call productsService.removePhoto with prodId and photoId', async () => {
    await controller.deletePhoto(1, 99);

    expect(productsServiceMock.removePhoto).toHaveBeenCalledWith(1, 99);
  });
});
