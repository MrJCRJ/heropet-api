import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FinancaDocument = Financa & Document;

@Schema({ timestamps: true })
export class Financa {
  @Prop({ required: true, enum: ["Investimento", "Despesa"] })
  tipo!: string;

  @Prop({ required: true })
  origem!: string;

  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true, type: Date })
  data!: Date; // Alterado para Date

  @Prop({ required: true, enum: ["Pago", "Pendente"] })
  status!: string;

  @Prop({ required: true })
  valor!: number;
}

export const FinancaSchema = SchemaFactory.createForClass(Financa);
