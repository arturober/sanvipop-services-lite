import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
  Length,
  Min,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity.js';

export class EditProductDto {
  /**
   * Título actualizado del producto
   * @example "Bicicleta de montaña 29 pulgadas (Rebajado)"
   */
  @IsString()
  @IsOptional()
  @Length(3, 250)
  title?: string;

  /**
   * Descripción actualizada del producto
   * @example "Bicicleta en excelente estado, recién revisada y puesta a punto."
   */
  @IsString()
  @IsOptional()
  @Length(10, 2000)
  description?: string;

  /**
   * Identificador de la nueva categoría
   * @example 2
   */
  @IsInt()
  @IsPositive()
  @IsOptional()
  category?: number;

  /**
   * Precio de venta en euros
   * @example 175.00
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  /**
   * Identificador de la foto principal asignada
   * @example 1
   */
  @IsInt()
  @IsOptional()
  @Min(1)
  mainPhoto?: number;

  /**
   * Estado actual del producto (1=Disponible, 2=Reservado, 3=Vendido)
   * @example 1
   */
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
