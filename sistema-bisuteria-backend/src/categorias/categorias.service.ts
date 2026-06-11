import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dtos/categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const existing = await this.categoriaRepository.findOne({
      where: { nombre: createCategoriaDto.nombre },
    });

    if (existing) {
      throw new BadRequestException('La categoría ya existe');
    }

    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async findAll(status?: boolean) {
    const query = this.categoriaRepository.createQueryBuilder('categoria');

    if (status !== undefined) {
      query.where('categoria.status = :status', { status });
    }

    query.orderBy('categoria.nombre', 'ASC');

    return query.getMany();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    Object.assign(categoria, updateCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    return this.categoriaRepository.softRemove(categoria);
  }
}