import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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

@Schema({ timestamps: true })
export class Pedido extends Document {
  @Prop({ type: String, enum: TipoPedido, required: true })
  tipo!: TipoPedido;

  @Prop({ type: String, enum: StatusPedido, default: StatusPedido.PENDENTE })
  status!: StatusPedido;

  @Prop({ type: String, required: true })
  documentoClienteFornecedor!: string;

  @Prop({ type: String, required: true })
  nomeClienteFornecedor!: string;

  @Prop({ type: Date, default: Date.now })
  dataPedido!: Date;

  @Prop({ type: Date, required: false })
  dataEntrega?: Date;

  @Prop([
    {
      produto: { type: String, required: true },
      quantidade: { type: Number, required: true, min: 1 },
      precoUnitario: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
  ])
  itens!: {
    produto: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }[];

  @Prop({ type: Number, required: true })
  totalPedido!: number;

  @Prop({ type: Boolean, default: false })
  parcelado?: boolean;

  @Prop({ type: Number, min: 1, max: 4, required: false })
  quantidadeParcelas?: number;

  @Prop({ type: Boolean, required: false })
  parcelamentoSemanal?: boolean;

  @Prop([
    {
      numero: { type: Number, required: true },
      dataVencimento: { type: Date, required: true },
      valor: { type: Number, required: true },
      pago: { type: Boolean, default: false },
    },
  ])
  parcelas?: {
    numero: number;
    dataVencimento: Date;
    valor: number;
    pago: boolean;
  }[];

  @Prop({ type: Boolean, default: false })
  temNotaFiscal?: boolean;

  @Prop({ type: String, required: false })
  observacoes?: string;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
