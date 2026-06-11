import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto, UpdateConsultaDto } from './dtos/consulta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultasService.create(createConsultaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.consultasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.consultasService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultasService.update(+id, updateConsultaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.consultasService.remove(+id);
  }
}