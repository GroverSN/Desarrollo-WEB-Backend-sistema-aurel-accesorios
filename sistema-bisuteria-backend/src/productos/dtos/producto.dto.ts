import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  @IsNumber()
  @IsOptional()
  imagenId?: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  @IsNumber()
  @IsOptional()
  imagenId?: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  imagenUrl?: string;
}