import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { vi, describe, beforeEach, beforeAll, afterAll, it, expect } from 'vitest';
import { ProductsService } from './products.service.js';
import { Product, ProductStatus } from './entities/product.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { ProductPhoto } from './entities/product-photo.entity.js';
import { ImageService } from '../../common/services/image/image.service.js';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import config from '../../config/database.config.js';
import { ProductSort } from './dto/products-query.dto.js';

describe('ProductsService', () => {
  let orm: MikroORM;
  let service: ProductsService;

  beforeAll(async () => {
    orm = await MikroORM.init({ ...config, connect: false });
  });

  afterAll(async () => {
    if (orm) {
      await orm.close();
    }
  });
  let emMock: {
    persist: ReturnType<typeof vi.fn>;
    flush: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let productRepoMock: {
    findOne: ReturnType<typeof vi.fn>;
    findAndCount: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    populate: ReturnType<typeof vi.fn>;
    getEntityManager: ReturnType<typeof vi.fn>;
  };
  let photoRepoMock: {
    findOne: ReturnType<typeof vi.fn>;
    getEntityManager: ReturnType<typeof vi.fn>;
  };
  let catRepoMock: {
    findOne: ReturnType<typeof vi.fn>;
  };
  let imageServiceMock: {
    saveImage: ReturnType<typeof vi.fn>;
    removeImage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    emMock = {
      persist: vi.fn(),
      flush: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn(),
    };

    productRepoMock = {
      findOne: vi.fn(),
      findAndCount: vi.fn().mockResolvedValue([[], 0]),
      count: vi.fn().mockResolvedValue(0),
      populate: vi.fn().mockImplementation((products) => Promise.resolve(products)),
      getEntityManager: vi.fn().mockReturnValue(emMock),
    };

    photoRepoMock = {
      findOne: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue(emMock),
    };

    catRepoMock = {
      findOne: vi.fn(),
    };

    imageServiceMock = {
      saveImage: vi.fn().mockResolvedValue('img/products/saved.jpg'),
      removeImage: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepoMock,
        },
        {
          provide: getRepositoryToken(ProductPhoto),
          useValue: photoRepoMock,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: catRepoMock,
        },
        {
          provide: ImageService,
          useValue: imageServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should query general catalog with default page 1 and date sort', async () => {
      await service.findAll({});

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        { $not: { status: ProductStatus.SOLD } },
        expect.objectContaining({
          limit: 12,
          offset: 0,
          orderBy: { datePublished: QueryOrder.DESC, id: QueryOrder.DESC },
        }),
      );
    });

    it('should paginate correctly with page 2', async () => {
      await service.findAll({ page: 2 });

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        { $not: { status: ProductStatus.SOLD } },
        expect.objectContaining({
          limit: 12,
          offset: 12,
        }),
      );
    });

    it('should sort by price ASC when sort=price', async () => {
      await service.findAll({ sort: ProductSort.PRICE });

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        { $not: { status: ProductStatus.SOLD } },
        expect.objectContaining({
          orderBy: { price: QueryOrder.ASC },
        }),
      );
    });

    it('should sort by views ASC when sort=views', async () => {
      await service.findAll({ sort: ProductSort.VIEWS });

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        { $not: { status: ProductStatus.SOLD } },
        expect.objectContaining({
          orderBy: { numVisits: QueryOrder.ASC },
        }),
      );
    });

    it('should filter by search in title or description', async () => {
      await service.findAll({ search: 'bici' });

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          $not: { status: ProductStatus.SOLD },
          $or: [
            { title: { $like: '%bici%' } },
            { description: { $like: '%bici%' } },
          ],
        }),
        expect.any(Object),
      );
    });

    it('should filter by category when category id is provided', async () => {
      await service.findAll({ category: 3 });

      expect(productRepoMock.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          $not: { status: ProductStatus.SOLD },
          category: 3,
        }),
        expect.any(Object),
      );
    });
  });

  describe('findById', () => {
    it('should return product and increment numVisits', async () => {
      const mockProduct = { id: 1, numVisits: 10 } as Product;
      productRepoMock.findOne.mockResolvedValue(mockProduct);

      const result = await service.findById(1);

      expect(productRepoMock.findOne).toHaveBeenCalledWith(
        { id: 1 },
        { populate: ['category', 'mainPhoto', 'photos'] },
      );
      expect(result.numVisits).toBe(11);
      expect(emMock.flush).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productRepoMock.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('insert', () => {
    it('should insert a product with main photo and category', async () => {
      const mockCategory = { id: 1, name: 'Informática' } as Category;
      catRepoMock.findOne.mockResolvedValue(mockCategory);

      const dto = {
        title: 'Teclado Mecánico',
        description: 'Teclado RGB en perfecto estado',
        price: 50.0,
        category: 1,
        mainPhoto: 'data:image/jpeg;base64,sample',
      };

      const product = await service.insert(dto);

      expect(imageServiceMock.saveImage).toHaveBeenCalledWith('products', dto.mainPhoto);
      expect(emMock.persist).toHaveBeenCalled();
      expect(emMock.flush).toHaveBeenCalled();
      expect(product.title).toBe(dto.title);
    });

    it('should throw BadRequestException if category does not exist', async () => {
      catRepoMock.findOne.mockResolvedValue(null);

      await expect(
        service.insert({
          title: 'Teclado',
          description: 'Desc',
          price: 50,
          category: 99,
          mainPhoto: 'data:image/jpeg;base64,sample',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update product fields', async () => {
      const mockProduct = {
        id: 1,
        title: 'Old Title',
        description: 'Old Desc',
        price: 100,
        status: ProductStatus.AVAILABLE,
      } as Product;
      productRepoMock.findOne.mockResolvedValue(mockProduct);

      const result = await service.update(1, {
        title: 'New Title',
        price: 120,
      });

      expect(result.title).toBe('New Title');
      expect(result.price).toBe(120);
      expect(emMock.flush).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product to update not found', async () => {
      productRepoMock.findOne.mockResolvedValue(null);

      await expect(service.update(999, { title: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete product and its photo files', async () => {
      const mockProduct = {
        id: 1,
        photos: {
          getItems: () => [{ url: 'img/products/1.jpg' }],
        },
      } as any;
      productRepoMock.findOne.mockResolvedValue(mockProduct);

      await service.delete(1);

      expect(emMock.remove).toHaveBeenCalledWith(mockProduct);
      expect(imageServiceMock.removeImage).toHaveBeenCalledWith('img/products/1.jpg');
    });

    it('should throw NotFoundException if product to delete not found', async () => {
      productRepoMock.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addPhoto', () => {
    it('should add a photo to the product', async () => {
      const mockProduct = {
        id: 1,
        photos: { add: vi.fn() },
      } as any;
      productRepoMock.findOne.mockResolvedValue(mockProduct);

      const result = await service.addPhoto(1, {
        photo: 'data:image/jpeg;base64,abc',
        setMain: true,
      });

      expect(imageServiceMock.saveImage).toHaveBeenCalledWith('products', 'data:image/jpeg;base64,abc');
      expect(emMock.persist).toHaveBeenCalled();
      expect(result.url).toBe('img/products/saved.jpg');
      expect(mockProduct.mainPhoto).toBe(result);
    });
  });

  describe('removePhoto', () => {
    it('should remove a photo from product and delete image file', async () => {
      const mockPhoto = { id: 10, url: 'img/products/10.jpg' };
      const mockProduct = {
        id: 1,
        photos: {
          getItems: () => [mockPhoto],
        },
        mainPhoto: mockPhoto,
      } as any;
      productRepoMock.findOne.mockResolvedValue(mockProduct);

      await service.removePhoto(1, 10);

      expect(emMock.remove).toHaveBeenCalledWith(mockPhoto);
      expect(imageServiceMock.removeImage).toHaveBeenCalledWith('img/products/10.jpg');
    });
  });
});
