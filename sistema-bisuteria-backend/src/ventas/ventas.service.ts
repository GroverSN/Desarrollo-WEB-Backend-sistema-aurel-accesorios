import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Venta, DetalleVenta, Producto } from '../entities';
import { MetodoPago } from '../common/enums/metodo-pago.enum';
import { CreateVentaDto } from './dtos/venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createVentaDto: CreateVentaDto, usuarioId: number) {
    const { detalles, metodoPago, clienteNombre, clienteTelefono } = createVentaDto;

    let total = 0;
    const detallesVenta: Partial<DetalleVenta>[] = [];

    for (const detalle of detalles) {
      const producto = await this.productoRepository.findOne({
        where: { id: detalle.productoId, status: true },
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);
      }

      if (producto.stock < detalle.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
      }

      const subtotal = Number(producto.precio) * detalle.cantidad;
      total += subtotal;

      producto.stock -= detalle.cantidad;
      await this.productoRepository.save(producto);

      detallesVenta.push({
        productoId: producto.id,
        cantidad: detalle.cantidad,
        precioUnitario: producto.precio,
        subtotal,
      });
    }

    const venta = this.ventaRepository.create({
      usuarioId,
      total,
      clienteNombre,
      ...(clienteTelefono ? { clienteTelefono } : {}),
      metodoPago: (metodoPago as MetodoPago) || MetodoPago.EFECTIVO,
      detalles: detallesVenta as DetalleVenta[],
    });

    return this.ventaRepository.save(venta);
  }

  async findAll() {
    return this.ventaRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  async findLatest(limit: number = 5) {
    return this.ventaRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async getVentasByDateRange(startDate: Date, endDate: Date) {
    return this.ventaRepository.find({
      where: {
        fecha: Between(startDate, endDate),
      },
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }
}