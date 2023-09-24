import { IsString, IsInt, IsNumber, IsOptional, Min, Max, ValidateIf} from 'class-validator';

export class EditProductDto {
    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    description: string

    @IsInt()
    @IsOptional()
    category: number;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsInt()
    @IsOptional()
    @Min(1)
    mainPhoto: number;

    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(3)
    status: number;

    @IsInt()
    @Min(1)
    @ValidateIf(p => p.status === 3)
    soldTo: number;
}
