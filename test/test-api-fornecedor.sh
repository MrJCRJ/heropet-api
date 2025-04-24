#!/bin/bash

# Configurações
API_URL="http://localhost:3000"
CNPJ_TESTE="12345678000195"
CNPJ_MINIMO="12345678000196"  # CNPJ diferente para o teste mínimo
CEP_TESTE="01001000"

# Função para imprimir resultados
print_result() {
  echo -e "▶ $1"
  if [ $2 -eq 0 ]; then
    echo -e "  ✓ Sucesso\n"
  else
    echo -e "  ✖ Erro (Status: $2)\n"
  fi
}

# 0. Testar criação mínima (apenas CNPJ)
echo "0. Criando fornecedor apenas com CNPJ..."
response=$(http --check-status --ignore-stdin POST ${API_URL}/fornecedores \
  cnpj=${CNPJ_MINIMO} 2>&1)
status=$?
print_result "POST /fornecedores (apenas CNPJ)" $status
echo "$response" | jq '.' || echo -e "Resposta:\n$response"

# 1. Testar criação completa de fornecedor
echo "1. Criando novo fornecedor completo..."
response=$(http --check-status --ignore-stdin POST ${API_URL}/fornecedores \
  cnpj=${CNPJ_TESTE} \
  nome="Fornecedor Teste Ltda" \
  nomeFantasia="Fornecedor Teste" \
  email="contato@fornecedorteste.com.br" \
  telefone="11999999999" \
  endereco:="{\"cep\":\"${CEP_TESTE}\",\"numero\":\"123\"}" 2>&1)
status=$?
print_result "POST /fornecedores (completo)" $status
echo "$response" | jq '.'

# 2. Testar listagem de fornecedores (GET)
echo "2. Listando todos os fornecedores..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/fornecedores 2>&1)
status=$?
print_result "GET /fornecedores" $status
echo "$response" | jq '.'

# 3. Testar busca por CNPJ (GET)
echo "3. Buscando fornecedor por CNPJ..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/fornecedores/${CNPJ_TESTE} 2>&1)
status=$?
print_result "GET /fornecedores/{cnpj}" $status
echo "$response" | jq '.'

# 4. Testar atualização (PUT)
echo "4. Atualizando fornecedor..."
update_data=$(cat <<EOF
{
  "cnpj": "${CNPJ_TESTE}",
  "nome": "Fornecedor Teste Atualizado",
  "email": "novoemail@fornecedorteste.com.br"
}
EOF
)

response=$(echo "$update_data" | http --check-status --ignore-stdin PUT ${API_URL}/fornecedores/${CNPJ_TESTE} Content-Type:application/json 2>&1)
status=$?
print_result "PUT /fornecedores/{cnpj}" $status
echo "$response" | jq '.' || echo -e "⚠️ Resposta não é JSON válido:\n$response"

# 5. Testar exclusão (DELETE)
echo "5. Removendo fornecedor..."
response=$(http --check-status --ignore-stdin DELETE ${API_URL}/fornecedores/${CNPJ_TESTE} 2>&1)
status=$?
print_result "DELETE /fornecedores/{cnpj}" $status

# 5. Testar exclusão (DELETE)
echo "5. Removendo fornecedor..."
response=$(http --check-status --ignore-stdin DELETE ${API_URL}/fornecedores/${CNPJ_MINIMO} 2>&1)
status=$?
print_result "DELETE /fornecedores/{cnpj}" $status

# 6. Verificar se foi removido
echo "6. Verificando exclusão..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/fornecedores/${CNPJ_TESTE} 2>&1)
status=$?
if [ $status -eq 0 ]; then
  echo -e "  ✖ Erro: Fornecedor ainda existe\n"
else
  echo -e "  ✓ Sucesso: Fornecedor não encontrado (como esperado)\n"
fi

echo "✅ Testes completos!"