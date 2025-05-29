import { IsEnum, IsString, IsDateString, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export enum TipoFinanca {
  Investimento = "Investimento",
  Despesa = "Despesa",
}

export enum StatusFinanca {
  Pago = "Pago",
  Pendente = "Pendente",
}

export class CreateFinancaDto {
  @IsEnum(TipoFinanca)
  tipo!: TipoFinanca;

  @IsString()
  origem!: string;

  @IsString()
  descricao!: string;

  @IsDateString()
  data!: string;

  @IsEnum(StatusFinanca)
  status!: StatusFinanca;

  @IsNumber()
  @Transform(({ value }) => {
    // Se já for número, retorna direto
    if (typeof value === "number") return value;

    // Se for string, converte para número
    if (typeof value === "string") {
      return parseFloat(
        value.replace("R$", "").replace(".", "").replace(",", ".")
      );
    }

    // Se não for nenhum dos dois, retorna NaN (será rejeitado pela validação)
    return NaN;
  })
  valor!: number;
}
