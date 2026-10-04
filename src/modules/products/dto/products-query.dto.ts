import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSort {
  DATE = 'date',
  PRICE = 'price',
  VIEWS = 'views',
  DISTANCE = 'distance',
}

export class ProductsQueryDto {
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
