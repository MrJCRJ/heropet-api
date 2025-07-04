import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class EnderecoDto {
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}

export class CreateFornecedorDto {
  @IsNotEmpty({ message: "CNPJ é obrigatório" })
  @IsString()
  @Length(14, 14, { message: "CNPJ deve ter exatamente 14 dígitos" })
  cnpj!: string;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("BR")
  telefone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;
}
