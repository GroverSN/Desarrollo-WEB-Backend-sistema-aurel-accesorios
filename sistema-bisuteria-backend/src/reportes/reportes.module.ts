import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Venta } from '../entities/venta.entity';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { Producto } from '../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Producto])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}