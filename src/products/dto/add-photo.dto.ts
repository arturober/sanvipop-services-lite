import { IsString, IsNotEmpty, IsBoolean, IsOptional } from "class-validator";

export class AddPhotoDto {
    @IsString()
    @IsNotEmpty()
    photo: string;

    @IsBoolean()
    @IsOptional()
    setMain = false;
}