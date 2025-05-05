// src/pedidos/interfaces/historico.interface.ts
export interface HistoricoMensal {
  mes: number;
  ano: number;
  compras: number;
  vendas: number;
  estoque: number;
}

export interface ProdutoHistoricoResponse {
  produtoId: string;
  nome: string;
  estoqueAtual: number;
  historicoMensal: HistoricoMensal[];
}

interface ProdutoHistorico {
  nome: string;
  estoqueAtual: number;
  historicoMensal: Record<string, HistoricoMensal>;
}

export interface HistoricoEstoque {
  [produtoId: string]: ProdutoHistorico;
}
