#!/bin/bash

# Configurações
API_URL="http://localhost:3000"
CNPJ_CLIENTE="12345678000195"
CNPJ_FORNECEDOR="98765432000198"
PRODUTO1_ID="507f1f77bcf86cd799439011"
PRODUTO2_ID="507f1f77bcf86cd799439012"

# Função auxiliar para fazer requests e tratar erros
make_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=${4:-200}
  
  echo -e "\n▶ $method $endpoint"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X $method -w "\n%{http_code}" "${API_URL}${endpoint}")
  else
    response=$(curl -s -X $method -H "Content-Type: application/json" -d "$data" -w "\n%{http_code}" "${API_URL}${endpoint}")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "  ✓ Sucesso (Status: $http_code)\n"
    if [ -n "$body" ]; then
      echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
    return 0
  else
    echo -e "  ✖ Erro (Status: $http_code)\n"
    echo "$body"
    return 1
  fi
}

# 1. Testar criação de pedido de venda
venda_data=$(cat <<EOF
{
  "tipo": "VENDA",
  "status": "PENDENTE",
  "documentoClienteFornecedor": "$CNPJ_CLIENTE",
  "nomeClienteFornecedor": "Cliente Teste Ltda",
  "dataPedido": "2023-05-15T10:00:00Z",
  "dataEntrega": "2023-05-20T10:00:00Z",
  "itens": [
    {
      "produto": "$PRODUTO1_ID",
      "quantidade": 2,
      "precoUnitario": 10.50,
      "total": 21.00
    },
    {
      "produto": "$PRODUTO2_ID",
      "quantidade": 1,
      "precoUnitario": 15.00,
      "total": 15.00
    }
  ],
  "totalPedido": 36.00,
  "temNotaFiscal": false,
  "observacoes": "Pedido de teste"
}
EOF
)

make_request "POST" "/pedidos" "$venda_data" 201
venda_id=$(echo "$body" | jq -r '._id')

# 2. Testar criação de pedido de compra (corrigido)
compra_data=$(cat <<EOF
{
  "tipo": "COMPRA",
  "status": "PENDENTE",
  "documentoClienteFornecedor": "$CNPJ_FORNECEDOR",
  "nomeClienteFornecedor": "Fornecedor Teste Ltda",
  "dataPedido": "2023-05-15T10:00:00Z",
  "itens": [
    {
      "produto": "$PRODUTO1_ID",
      "quantidade": 5,
      "precoUnitario": 8.00,
      "total": 40.00
    }
  ],
  "totalPedido": 40.00,
  "temNotaFiscal": true,
  "observacoes": "Pedido de compra teste"
}
EOF
)

make_request "POST" "/pedidos" "$compra_data" 201
compra_id=$(echo "$body" | jq -r '._id')

# Verificar se o ID foi capturado corretamente
if [ -z "$compra_id" ] || [ "$compra_id" = "null" ]; then
  echo "  ✖ Erro: Falha ao capturar ID do pedido de compra"
  exit 1
fi

# 3. Testar listagem de todos os pedidos
make_request "GET" "/pedidos"

# 4. Testar listagem filtrada por tipo (VENDA)
make_request "GET" "/pedidos?tipo=VENDA"

# 5. Testar busca de pedido por ID
make_request "GET" "/pedidos/$venda_id"

# 6. Testar atualização de pedido
update_data=$(cat <<EOF
{
  "status": "PROCESSANDO",
  "observacoes": "Pedido em processamento"
}
EOF
)

make_request "PUT" "/pedidos/$venda_id" "$update_data"

# 7. Testar atualização de itens do pedido
update_itens_data=$(cat <<EOF
{
  "itens": [
    {
      "produto": "$PRODUTO1_ID",
      "quantidade": 3,
      "precoUnitario": 10.50,
      "total": 31.50
    }
  ],
  "totalPedido": 31.50
}
EOF
)

make_request "PUT" "/pedidos/$venda_id" "$update_itens_data"

# 8. Testar exclusão de pedido
make_request "DELETE" "/pedidos/$compra_id" "" 200

# 9. Verificar se o pedido foi removido
make_request "GET" "/pedidos/$compra_id" "" 404
if [ $? -eq 0 ]; then
  echo -e "  ✓ Sucesso: Pedido não encontrado (como esperado)\n"
else
  echo -e "  ✖ Erro: Pedido ainda existe\n"
fi

# 10. Testar criação de pedido com dados mínimos (corrigido)
min_data=$(cat <<EOF
{
  "tipo": "VENDA",
  "status": "PENDENTE",
  "documentoClienteFornecedor": "$CNPJ_CLIENTE",
  "nomeClienteFornecedor": "Cliente Mínimo Ltda",
  "dataPedido": "2023-05-15T10:00:00Z",
  "itens": [
    {
      "produto": "$PRODUTO1_ID",
      "quantidade": 1,
      "precoUnitario": 10.00,
      "total": 10.00
    }
  ],
  "totalPedido": 10.00,
  "temNotaFiscal": false,
  "observacoes": ""
}
EOF
)

make_request "POST" "/pedidos" "$min_data" 201

echo "✅ Testes de pedidos completos!"