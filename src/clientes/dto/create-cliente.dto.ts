// File: src/clientes/dto/create-cliente.dto.ts
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  cpfOuCnpj!: string;

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
