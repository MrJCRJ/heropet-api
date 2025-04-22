// src/fornecedores/schemas/fornecedor.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Fornecedor extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  cnpj!: string;

  @Prop({ type: String, required: false })
  nome?: string;

  @Prop({ type: String, required: false })
  nomeFantasia?: string;

  @Prop({ type: String, required: false })
  email?: string;

  @Prop({ type: String, required: false })
  telefone?: string;

  @Prop({
    type: {
      cep: { type: String, required: false },
      numero: { type: String, required: false },
      complemento: { type: String, required: false },
      logradouro: { type: String, required: false },
      bairro: { type: String, required: false },
      cidade: { type: String, required: false },
      estado: { type: String, required: false },
    },
    required: true,
  })
  endereco!: {
    cep?: string;
    numero?: string;
    complemento?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
}

export const FornecedorSchema = SchemaFactory.createForClass(Fornecedor);
