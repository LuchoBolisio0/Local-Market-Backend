import { BadRequestException,  Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger("Categories Service")
  constructor(private prisma:PrismaService) {}

  //TODO PREGUNTAR POR EL updateProductDTO
  async create(CreateProductDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: CreateProductDto.categoryId },
    });
  
    if (!existingCategory) {
      throw new BadRequestException('La categoría especificada no es válida.');
    }

    const existingProduct = await this.prisma.product.findFirst({
      where: { name: CreateProductDto.name }
    });
  
    if (existingProduct) {
      throw new BadRequestException('El nombre del producto ya está registrado.');
    }
  
    try {
      return await this.prisma.product.create({
        data: CreateProductDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al crear el producto.');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Los valores de paginación deben ser positivos.');
    }

    const totalProduct = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalProduct / limit);

    try {
      const products = await this.prisma.product.findMany({
        where: { available: true },
        include: {
          category: true
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: products,
        metaData: {
          totalProduct,
          page,
          lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al obtener todas los productos.');
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('El ID es obligatorio.');
    }

    const product = await this.prisma.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con el id ${id} no fue encontrado`);
    }
    return product;
  }

  //TODO PREGUNTAR POR EL updateProductDTO
  async update(id: string,  UpdateProductDto) {

    const product = await this.prisma.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con el id ${id} no fue encontrado`);
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: UpdateProductDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al actualizar el producto.');
    }
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException(`Error al encontrar el id ${id}`);
    }

    try {
      await this.prisma.product.update({
        where: { id },
        data: {
          available: false,
        },
      });
      return 'Producto eliminado satisfactoriamente';
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al eliminar el producto.');
    }
  }
}
