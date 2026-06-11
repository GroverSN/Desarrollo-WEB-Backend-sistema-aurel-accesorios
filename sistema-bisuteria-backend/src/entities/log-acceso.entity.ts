import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('logs_acceso')
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 45 })
  ip: string;

  @Column({ length: 20 })
  evento: string;

  @Column({ length: 255, nullable: true })
  browser: string;

  @CreateDateColumn()
  timestamp: Date;
}