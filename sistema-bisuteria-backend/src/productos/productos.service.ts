import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Imagen } from '../entities/imagen.entity';
import { CreateProductoDto, UpdateProductoDto } from './dtos/producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Imagen)
    private imagenRepository: Repository<Imagen>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const existing = await this.productoRepository.findOne({
      where: { codigo: createProductoDto.codigo },
    });

    if (existing) {
      throw new BadRequestException('El código del producto ya existe');
    }

    let imagenId: number | undefined;

    if (createProductoDto.imagenUrl) {
      const imagen = this.imagenRepository.create({
        url: createProductoDto.imagenUrl,
      });
      const savedImagen = await this.imagenRepository.save(imagen);
      imagenId = savedImagen.id;
    }

    const producto = this.productoRepository.create({
      ...createProductoDto,
      imagenId,
    });
    
    return this.productoRepository.save(producto);
  }

  async findAllPublic(categoriaId?: number, status: boolean = true) {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.imagen', 'imagen')
      .where('producto.status = :status', { status });

    if (categoriaId) {
      query.andWhere('producto.categoriaId = :categoriaId', { categoriaId });
    }

    query.orderBy('producto.nombre', 'ASC');

    return query.getMany();
  }

  async findAll(categoriaId?: number, status?: boolean) {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.imagen', 'imagen');

    if (status !== undefined) {
      query.where('producto.status = :status', { status });
    }

    if (categoriaId) {
      query.andWhere('producto.categoriaId = :categoriaId', { categoriaId });
    }

    query.orderBy('producto.nombre', 'ASC');

    return query.getMany();
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'imagen'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async findOnePublic(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id, status: true },
      relations: ['categoria', 'imagen'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id);

    if (updateProductoDto.codigo && updateProductoDto.codigo !== producto.codigo) {
      const existing = await this.productoRepository.findOne({
        where: { codigo: updateProductoDto.codigo },
      });
      if (existing) {
        throw new BadRequestException('El código del producto ya existe');
      }
    }

    const updateData: Partial<Producto> = {};
    
    if (updateProductoDto.codigo !== undefined) updateData.codigo = updateProductoDto.codigo;
    if (updateProductoDto.nombre !== undefined) updateData.nombre = updateProductoDto.nombre;
    if (updateProductoDto.descripcion !== undefined) updateData.descripcion = updateProductoDto.descripcion;
    if (updateProductoDto.precio !== undefined) updateData.precio = updateProductoDto.precio;
    if (updateProductoDto.stock !== undefined) updateData.stock = updateProductoDto.stock;
    if (updateProductoDto.categoriaId !== undefined) updateData.categoriaId = updateProductoDto.categoriaId;
    if (updateProductoDto.imagenId !== undefined) updateData.imagenId = updateProductoDto.imagenId;
    if (updateProductoDto.status !== undefined) updateData.status = updateProductoDto.status;

    if (updateProductoDto.imagenUrl !== undefined) {
      if (updateProductoDto.imagenUrl) {
        const imagen = this.imagenRepository.create({
          url: updateProductoDto.imagenUrl,
        });
        const savedImagen = await this.imagenRepository.save(imagen);
        updateData.imagenId = savedImagen.id;
      } else {
        updateData.imagenId = undefined;
      }
    }

    Object.assign(producto, updateData);
    return this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productoRepository.softRemove(producto);
  }

  async updateStock(id: number, cantidad: number) {
    const producto = await this.findOne(id);
    const newStock = producto.stock + cantidad;

    if (newStock < 0) {
      throw new BadRequestException('Stock insuficiente');
    }

    producto.stock = newStock;
    return this.productoRepository.save(producto);
  }
}