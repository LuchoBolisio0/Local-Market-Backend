import {  BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger("Categories Service")
  constructor(private prisma:PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    
    const category  = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (category) {
      if (!category.available) {
        return await this.prisma.category.update({
          where: { id: category.id },
          data: { available: true }
        });
    }
    throw new BadRequestException('El nombre de la categoría ya fue utilizado');
    }
    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Error al crear la categoría.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany({
        where: {available: true}
      })
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Error al obtener todas las categorías.');
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category ${updateCategoryDto}`;
  }

  async remove(id: string) {

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category){
      throw new BadRequestException(`Error al encontrar el id ${id}` );
    }

    try {
      await this.prisma.category.update({
        where: {id},
        data: {
          available: false
        }
      })
      return 'Categoría eliminada satisfactoriamente'
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Error al eliminar la categoría.');
    }
  }
}
