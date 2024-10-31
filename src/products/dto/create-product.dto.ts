import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength, } from "class-validator";
import { UnitsProducts } from "src/enums/units-products.enum";

export class CreateProductDto {
    @IsString({ message: "El nombre es obligatorio" })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MinLength(3, { message: "El nombre debe ser mayor o igual a 3 carácter"})
    name: string;

    @IsString({ message: "La descripción debe ser una cadena de texto"})
    @MinLength(10,{ message: "La descripción debe ser mayor o igual a 10 carácter"})
    @IsNotEmpty({ message: 'La descripción es obligatorio.' })
    description: string;

    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: "El precio debe ser un número" })
    @IsNotEmpty({ message: 'El precio es obligatorio.'})
    @Type(()=>Number)
    price: number;

    @IsString({ message: 'El categoryId debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El categoryId es obligatorio.' })
    categoryId: string;

    @Min(1,{message:"stock no debe ser menor que 1"})
    @IsPositive({message:"stock debe ser un número positivo"})
    stock: number;

    @IsEnum(UnitsProducts,{
        message: 'Las unidades deben ser uno de los siguientes valores: kg, Litros, Unidad',
    })
    units: UnitsProducts;
}
