import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'El nombre debe ser un texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MinLength(3,{ message: "El nombre debe ser mayor o igual a 3 carácter"})
    name: string;
}
