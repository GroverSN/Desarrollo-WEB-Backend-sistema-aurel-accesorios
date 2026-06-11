import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dtos/venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ventas')
@UseGuards(JwtAuthGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto, @Request() req: Request & { user: { id: number } }) {
    return this.ventasService.create(createVentaDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('latest')
  findLatest(@Query('limit') limit?: string) {
    return this.ventasService.findLatest(limit ? +limit : 5);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}