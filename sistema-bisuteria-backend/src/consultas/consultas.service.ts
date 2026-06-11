import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from '../entities/consulta.entity';
import { CreateConsultaDto, UpdateConsultaDto } from './dtos/consulta.dto';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
  ) {}

  async create(createConsultaDto: CreateConsultaDto) {
    const consulta = this.consultaRepository.create({
      ...createConsultaDto,
      status: 'pendiente',
    });
    return this.consultaRepository.save(consulta);
  }

  async findAll() {
    return this.consultaRepository.find({
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const consulta = await this.consultaRepository.findOne({
      where: { id },
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    return consulta;
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.findOne(id);
    Object.assign(consulta, updateConsultaDto);
    return this.consultaRepository.save(consulta);
  }

  async remove(id: number) {
    const consulta = await this.findOne(id);
    return this.consultaRepository.softRemove(consulta);
  }
}