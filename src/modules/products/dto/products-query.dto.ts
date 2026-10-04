import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSort {
  DATE = 'date',
  PRICE = 'price',
  VIEWS = 'views',
  DISTANCE = 'distance',
}

export class ProductsQueryDto {
  /**
   * Número de página para la paginación (por defecto 1, siempre 12 resultados por página)
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Criterio de ordenación ('date', 'price', 'views'). Por defecto 'date'.
   * @example "date"
   */
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort = ProductSort.DATE;

  /**
   * Cadena de texto para filtrar productos por título o descripción
   * @example "bicicleta"
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Identificador de la categoría para filtrar productos
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  category?: number;
}
