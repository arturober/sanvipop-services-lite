import { IsString, IsNotEmpty, IsInt, IsNumber} from 'class-validator';

export class InsertProductDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsInt()
    @IsNotEmpty()
    category: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    mainPhoto: string;
}