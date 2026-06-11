import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('imagenes')
export class Imagen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  url: string;

  @Column({ name: 'public_id', length: 255, nullable: true })
  publicId: string;

  @OneToOne(() => Producto, (producto) => producto.imagen)
  producto: Producto;
}