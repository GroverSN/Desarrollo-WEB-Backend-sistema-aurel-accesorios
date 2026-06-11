import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

export class UpdateCategoriaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}