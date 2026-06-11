import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';
import { Imagen } from './imagen.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ name: 'categoria_id', nullable: true })
  categoriaId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ name: 'imagen_id', nullable: true })
  imagenId: number;

  @ManyToOne(() => Imagen, (imagen) => imagen.producto, { nullable: true })
  @JoinColumn({ name: 'imagen_id' })
  imagen: Imagen;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detalleVentas: DetalleVenta[];
}