import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from '../entities/producto.entity';
import { Imagen } from '../entities/imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Imagen])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}