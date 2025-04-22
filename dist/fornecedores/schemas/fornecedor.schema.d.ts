import { Document } from "mongoose";
export declare class Fornecedor extends Document {
    cnpj: string;
    nome?: string;
    nomeFantasia?: string;
    email?: string;
    telefone?: string;
    endereco: {
        cep?: string;
        numero?: string;
        complemento?: string;
        logradouro?: string;
        bairro?: string;
        cidade?: string;
        estado?: string;
    };
}
export declare const FornecedorSchema: import("mongoose").Schema<Fornecedor, import("mongoose").Model<Fornecedor, any, any, any, Document<unknown, any, Fornecedor> & Fornecedor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fornecedor, Document<unknown, {}, import("mongoose").FlatRecord<Fornecedor>> & import("mongoose").FlatRecord<Fornecedor> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
