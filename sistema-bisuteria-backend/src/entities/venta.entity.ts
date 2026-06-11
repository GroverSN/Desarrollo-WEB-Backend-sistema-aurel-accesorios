import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { MetodoPago } from '../common/enums/metodo-pago.enum';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'cliente_nombre', type: 'varchar', length: 120, nullable: true })
  clienteNombre?: string;

  @Column({ name: 'cliente_telefono', type: 'varchar', length: 20, nullable: true })
  clienteTelefono?: string;

  @Column({ name: 'metodo_pago', type: 'varchar', length: 20, default: MetodoPago.EFECTIVO })
  metodoPago: MetodoPago;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];
}