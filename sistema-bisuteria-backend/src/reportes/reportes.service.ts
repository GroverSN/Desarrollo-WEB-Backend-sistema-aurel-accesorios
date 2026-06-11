import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import PDFDocument from 'pdfkit';
import { Venta, DetalleVenta, Producto } from '../entities';

export interface MonthlyStats {
  mes: string;
  totalVentas: number;
  cantidadVentas: number;
}

export interface TopProduct {
  productoId: number;
  nombre: string;
  totalVendido: number;
  ingresos: number;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async generatePDFReport(startDate: Date, endDate: Date, cliente?: string) {
    const where: any = {
      fecha: Between(startDate, endDate),
    };

    if (cliente) {
      where.clienteNombre = ILike(`%${cliente}%`);
    }

    const ventas = await this.ventaRepository.find({
      where,
      relations: ['detalles', 'detalles.producto', 'usuario'],
      order: { fecha: 'DESC' },
    });

    const totalIngresos = ventas.reduce((sum, v) => sum + Number(v.total), 0);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Reporte de Ventas', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Total de ventas: ${ventas.length}`);
      doc.text(`Ingresos totales: Bs ${totalIngresos.toFixed(2)}`);
      doc.moveDown();

      doc.fontSize(14).text('Detalle de Ventas', { underline: true });
      doc.moveDown();

      ventas.forEach((venta, index) => {
        doc.fontSize(10).text(`Venta #${index + 1} - Fecha: ${venta.fecha.toLocaleString()}`);
        doc.text(`Cliente: ${venta.clienteNombre || 'N/A'}${venta.clienteTelefono ? ` - Tel: ${venta.clienteTelefono}` : ''}`);
        doc.text(`Método de pago: ${venta.metodoPago}`);
        doc.text(`Total: Bs ${Number(venta.total).toFixed(2)}`);
        
        if (venta.detalles?.length) {
          doc.text('Productos:');
          venta.detalles.forEach(detalle => {
            doc.text(`  - ${detalle.producto?.nombre || 'N/A'} x${detalle.cantidad} = Bs ${Number(detalle.subtotal).toFixed(2)}`);
          });
        }
        doc.moveDown();
      });

      doc.end();
    });
  }

  async getMonthlyStats(year: number): Promise<MonthlyStats[]> {
    const stats: MonthlyStats[] = [];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    for (let mes = 0; mes < 12; mes++) {
      const startDate = new Date(year, mes, 1);
      const endDate = new Date(year, mes + 1, 0, 23, 59, 59);

      const ventas = await this.ventaRepository.find({
        where: {
          fecha: Between(startDate, endDate),
        },
      });

      stats.push({
        mes: meses[mes],
        totalVentas: Number(ventas.reduce((sum, v) => sum + Number(v.total), 0)),
        cantidadVentas: ventas.length,
      });
    }

    return stats;
  }

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    try {
      const result = await this.detalleVentaRepository
        .createQueryBuilder('detalle')
        .select('detalle.productoId', 'productoId')
        .addSelect('producto.nombre', 'nombre')
        .addSelect('SUM(detalle.cantidad)', 'total_vendido')
        .addSelect('SUM(detalle.subtotal)', 'ingresos')
        .innerJoin('detalle.producto', 'producto')
        .groupBy('detalle.productoId')
        .addGroupBy('producto.nombre')
        .orderBy('total_vendido', 'DESC')
        .limit(limit)
        .getRawMany();

      return result.map((r) => ({
        productoId: r.productoId,
        nombre: r.nombre,
        totalVendido: Number(r.total_vendido) || 0,
        ingresos: Number(r.ingresos) || 0,
      }));
    } catch (error) {
      console.error('Error getting top products:', error);
      return [];
    }
  }

  async getResumenGeneral() {
    try {
      const totalVentas = await this.ventaRepository.count();
      const totalIngresos = await this.ventaRepository
        .createQueryBuilder('venta')
        .select('SUM(venta.total)', 'total')
        .getRawOne();

      const totalProductos = await this.productoRepository.count({
        where: { status: true },
      });

      const lowStock = await this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.stock < :stock', { stock: 5 })
        .andWhere('producto.status = :status', { status: true })
        .getMany();

      return {
        totalVentas,
        totalIngresos: Number(totalIngresos?.total || 0),
        totalProductos,
        productosStockBajo: lowStock.length,
        productosStockBajoDetalle: lowStock.map(p => ({
          id: p.id,
          nombre: p.nombre,
          stock: p.stock,
        })),
      };
    } catch (error) {
      console.error('Error getting resumen:', error);
      return {
        totalVentas: 0,
        totalIngresos: 0,
        totalProductos: 0,
        productosStockBajo: 0,
        productosStockBajoDetalle: [],
      };
    }
  }
}