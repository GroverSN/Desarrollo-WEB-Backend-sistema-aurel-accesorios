import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  productos: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({ length: 20, default: 'pendiente' })
  status: string;
}