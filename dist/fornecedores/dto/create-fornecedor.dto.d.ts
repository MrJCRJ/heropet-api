declare class EnderecoDto {
    cep?: string;
    numero?: string;
    complemento?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
}
export declare class CreateFornecedorDto {
    cnpj: string;
    nome?: string;
    nomeFantasia?: string;
    email?: string;
    telefone?: string;
    endereco?: EnderecoDto;
}
export {};
