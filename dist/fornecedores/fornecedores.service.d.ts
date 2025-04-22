import { Model } from "mongoose";
import { Fornecedor } from "./schemas/fornecedor.schema";
import { CreateFornecedorDto } from "./dto/create-fornecedor.dto";
export declare class FornecedoresService {
    private fornecedorModel;
    private readonly logger;
    constructor(fornecedorModel: Model<Fornecedor>);
    criar(fornecedorDto: CreateFornecedorDto): Promise<Fornecedor>;
    buscarTodos(): Promise<Fornecedor[]>;
    buscarPorCnpj(cnpj: string): Promise<Fornecedor | null>;
    atualizar(cnpj: string, fornecedorDto: CreateFornecedorDto): Promise<Fornecedor | null>;
    remover(cnpj: string): Promise<{
        deletedCount: number;
    }>;
}
