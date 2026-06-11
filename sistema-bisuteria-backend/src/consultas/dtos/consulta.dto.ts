import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateConsultaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  productos?: string;
}

export class UpdateConsultaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  productos?: string;

  @IsString()
  @IsOptional()
  status?: string;
}