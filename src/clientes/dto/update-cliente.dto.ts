// File: src/clientes/dto/update-cliente.dto.ts
import { IsString, IsOptional } from "class-validator";

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  complemento?: string;
}
