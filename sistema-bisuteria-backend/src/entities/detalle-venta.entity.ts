import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from './producto.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, (producto) => producto.detalleVentas)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column()
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}