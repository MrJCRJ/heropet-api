import {
  IsEnum,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
  Min,
  IsBoolean,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export enum TipoPedido {
  COMPRA = "COMPRA",
  VENDA = "VENDA",
}

export enum StatusPedido {
  PENDENTE = "PENDENTE",
  PROCESSANDO = "PROCESSANDO",
  PAGO = "PAGO",
  CANCELADO = "CANCELADO",
  ATRASADO = "ATRASADO",
}

class ItemPedidoDto {
  @IsNotEmpty()
  @IsString()
  produto!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precoUnitario!: number;

  @IsNotEmpty()
  @IsNumber()
  total!: number;
}

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsEnum(TipoPedido)
  tipo!: TipoPedido;

  @IsNotEmpty()
  @IsEnum(StatusPedido)
  status!: StatusPedido;

  @IsNotEmpty()
  @IsString()
  documentoClienteFornecedor!: string;

  @IsNotEmpty()
  @IsString()
  nomeClienteFornecedor!: string;

  @IsNotEmpty()
  @IsDateString()
  dataPedido!: string;

  @IsOptional()
  @IsDateString()
  dataEntrega?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens!: ItemPedidoDto[];

  @IsNotEmpty()
  @IsNumber()
  totalPedido!: number;

  @IsBoolean()
  temNotaFiscal!: boolean;

  @IsString()
  observacoes?: string;
}
