import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dtos/producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAllPublic(@Query('categoriaId') categoriaId?: string) {
    const categoriaIdNum = categoriaId ? +categoriaId : undefined;
    return this.productosService.findAllPublic(categoriaIdNum);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  findAll(@Query('categoriaId') categoriaId?: string, @Query('status') status?: string) {
    const categoriaIdNum = categoriaId ? +categoriaId : undefined;
    const statusBool = status === 'true' ? true : status === 'false' ? false : undefined;
    return this.productosService.findAll(categoriaIdNum, statusBool);
  }

  @Get(':id')
  findOnePublic(@Param('id') id: string) {
    return this.productosService.findOnePublic(+id);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}