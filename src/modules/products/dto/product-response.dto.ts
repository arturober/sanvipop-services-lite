import type { Request } from 'express';
import { Product } from '../entities/product.entity.js';
import { buildFullImageUrl } from '../../../common/utils/image-url.util.js';

export class ProductCategoryResponseDto {
  /**
   * Identificador de la categoría
   * @example 4
   */
  id!: number;

  /**
   * Nombre de la categoría
   * @example "Deportes"
   */
  name!: string;
}

export class ProductPhotoItemDto {
  /**
   * Identificador de la foto
   * @example 1
   */
  id!: number;

  /**
   * URL absoluta de la foto
   * @example "http://localhost:3000/img/products/product-1.jpg"
   */
  url!: string;
}

export class ProductResponseDto {
  /**
   * Identificador único del producto
   * @example 1
   */
  id!: number;

  /**
   * Título del producto
   * @example "Bicicleta de montaña Rockrider"
   */
  title!: string;

  /**
   * Descripción del producto
   * @example "Bicicleta en perfecto estado, talla M..."
   */
  description!: string;

  /**
   * Precio en euros
   * @example 150.0
   */
  price!: number;

  /**
   * Estado del producto (1: Disponible, 2: Reservado, 3: Vendido)
   * @example 1
   */
  status!: number;

  /**
   * Fecha de publicación
   * @example "2026-03-15T10:00:00.000Z"
   */
  datePublished!: Date;

  /**
   * Número de visitas recibidas
   * @example 24
   */
  numVisits!: number;

  /**
   * Categoría a la que pertenece el producto
   */
  category!: ProductCategoryResponseDto;

  /**
   * URL absoluta de la foto principal del producto
   * @example "http://localhost:3000/img/products/product-1.jpg"
   */
  mainPhoto?: string;

  /**
   * Galería de fotografías asociadas al producto
   */
  photos?: ProductPhotoItemDto[];

  /**
   * Método estático de factoría para transformar una entidad Product a ProductResponseDto
   */
  static fromEntity(product: Product, req?: Request): ProductResponseDto {
    let mainPhotoUrl: string | undefined;
    if (product.mainPhoto) {
      const rawUrl =
        typeof product.mainPhoto === 'string'
          ? product.mainPhoto
          : (product.mainPhoto as any).url;
      if (rawUrl) {
        mainPhotoUrl = buildFullImageUrl(req, rawUrl);
      }
    }

    let photosList: ProductPhotoItemDto[] | undefined;
    if (product.photos) {
      const rawPhotos =
        typeof (product.photos as any).getItems === 'function'
          ? (product.photos as any).getItems()
          : Array.isArray(product.photos)
            ? product.photos
            : [];

      if (rawPhotos.length > 0) {
        photosList = rawPhotos.map((photo: any) => ({
          id: photo.id,
          url: buildFullImageUrl(req, photo.url),
        }));
      }
    }

    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.title = product.title;
    dto.description = product.description;
    dto.price = product.price;
    dto.status = Number(product.status);
    dto.datePublished = product.datePublished;
    dto.numVisits = product.numVisits ?? 0;
    dto.category = {
      id: product.category?.id,
      name: product.category?.name,
    };
    dto.mainPhoto = mainPhotoUrl;
    dto.photos = photosList;

    return dto;
  }
}

/**
 * DTO que encapsula los metadatos de paginación de productos.
 */
export class ProductsPaginationDto {
  /**
   * Página actual solicitada
   * @example 1
   */
  page!: number;

  /**
   * Número total de páginas disponibles
   * @example 3
   */
  total_pages!: number;

  /**
   * Total de elementos disponibles en la consulta
   * @example 28
   */
  total_products!: number;
}

/**
 * DTO que contiene el listado de productos de base de datos y sus metadatos de paginación.
 */
export class PaginatedProductsDto extends ProductsPaginationDto {
  products!: Product[];

  static create(
    products: Product[],
    page: number,
    limit: number,
    total_products: number,
  ): PaginatedProductsDto {
    const dto = new PaginatedProductsDto();
    dto.products = products;
    dto.page = page;
    dto.total_pages = Math.ceil(total_products / limit);
    dto.total_products = total_products;
    return dto;
  }
}

/**
 * DTO de respuesta paginada con productos formateados para el cliente.
 */
export class PaginatedProductsResponseDto extends ProductsPaginationDto {
  /**
   * Lista de productos de la página actual
   */
  products!: ProductResponseDto[];

  static from(
    result: PaginatedProductsDto,
    req?: Request,
  ): PaginatedProductsResponseDto {
    const dto = new PaginatedProductsResponseDto();
    dto.products = result.products.map((p) =>
      ProductResponseDto.fromEntity(p, req),
    );
    dto.page = result.page;
    dto.total_pages = result.total_pages;
    dto.total_products = result.total_products;
    return dto;
  }
}

export class ProductsResponseDto {
  /**
   * Lista de productos
   */
  products!: ProductResponseDto[];

  static from(products: Product[], req?: Request): ProductsResponseDto {
    const dto = new ProductsResponseDto();
    dto.products = products.map((p) => ProductResponseDto.fromEntity(p, req));
    return dto;
  }
}

export class SingleProductResponseDto {
  /**
   * Detalle del producto
   */
  product!: ProductResponseDto;

  static from(product: Product, req?: Request): SingleProductResponseDto {
    const dto = new SingleProductResponseDto();
    dto.product = ProductResponseDto.fromEntity(product, req);
    return dto;
  }
}

export class PhotoUploadResponseDto {
  /**
   * Foto subida
   */
  photo!: ProductPhotoItemDto;

  static from(photo: any, req?: Request): PhotoUploadResponseDto {
    const dto = new PhotoUploadResponseDto();
    dto.photo = {
      id: photo.id,
      url: buildFullImageUrl(req, photo.url),
    };
    return dto;
  }
}

export const toProductResponseDto = ProductResponseDto.fromEntity;
