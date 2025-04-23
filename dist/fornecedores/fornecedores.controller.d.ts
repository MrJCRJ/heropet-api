import { FornecedoresService } from "./fornecedores.service";
import { CreateFornecedorDto } from "./dto/create-fornecedor.dto";
import { Fornecedor } from "./schemas/fornecedor.schema";
export declare class FornecedoresController {
    private readonly fornecedoresService;
    constructor(fornecedoresService: FornecedoresService);
    criar(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor>;
    buscarTodos(): Promise<Fornecedor[]>;
    buscarPorCnpj(cnpj: string): Promise<Fornecedor>;
    atualizar(cnpj: string, updateFornecedorDto: Partial<CreateFornecedorDto>): Promise<Fornecedor>;
    remover(cnpj: string): Promise<void>;
}
