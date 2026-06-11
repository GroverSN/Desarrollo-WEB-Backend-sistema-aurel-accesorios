import { IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CreateVentaDto {
  @IsNumber()
  @IsOptional()
  usuarioId?: number;

  @IsString()
  @IsOptional()
  metodoPago?: string;

  @IsString()
  clienteNombre: string;

  @IsString()
  @IsOptional()
  clienteTelefono?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}