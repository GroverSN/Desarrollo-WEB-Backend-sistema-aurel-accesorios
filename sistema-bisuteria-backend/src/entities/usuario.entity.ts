import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { LogAcceso } from './log-acceso.entity';
import { Venta } from './venta.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20, default: 'user' })
  rol: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => LogAcceso, (log) => log.usuario)
  logs: LogAcceso[];

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];
}