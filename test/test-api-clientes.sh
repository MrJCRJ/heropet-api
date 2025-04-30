#!/bin/bash

# Configurações
API_URL="http://localhost:3000"
CPF_TESTE="12345678901"
CPF_MINIMO="12345678902"
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

# 0. Testar criação mínima (apenas CPF/CNPJ)
echo "0. Criando cliente apenas com CPF/CNPJ..."
response=$(http --check-status --ignore-stdin POST ${API_URL}/clientes \
  cpfOuCnpj="${CPF_MINIMO}" \
  Content-Type:application/json 2>&1)
status=$?
print_result "POST /clientes (apenas CPF/CNPJ)" $status
echo "$response" | jq '.' || echo -e "Resposta completa:\n$response"

# 1. Testar criação completa de cliente
echo "1. Criando novo cliente completo..."
response=$(http --check-status --ignore-stdin POST ${API_URL}/clientes \
  cpfOuCnpj="${CPF_TESTE}" \
  nome="Cliente Teste Silva" \
  telefone="11988887777" \
  cep="${CEP_TESTE}" \
  numero="456" \
  complemento="Apto 101" \
  Content-Type:application/json 2>&1)
status=$?
print_result "POST /clientes (completo)" $status
echo "$response" | jq '.' || echo -e "Resposta completa:\n$response"

# 2. Testar listagem de clientes (GET)
echo "2. Listando todos os clientes..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/clientes 2>&1)
status=$?
print_result "GET /clientes" $status
echo "$response" | jq '.'

# 3. Testar busca por CPF/CNPJ (GET)
echo "3. Buscando cliente por CPF/CNPJ..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/clientes/${CPF_TESTE} 2>&1)
status=$?
print_result "GET /clientes/{cpfOuCnpj}" $status
echo "$response" | jq '.'

# 4. Testar atualização (PUT)
echo "4. Atualizando cliente..."
update_data=$(cat <<EOF
{
  "nome": "Cliente Teste Atualizado",
  "telefone": "11977776666",
  "complemento": "Apto 202"
}
EOF
)

response=$(echo "$update_data" | http --check-status --ignore-stdin PUT ${API_URL}/clientes/${CPF_TESTE} Content-Type:application/json 2>&1)
status=$?
print_result "PUT /clientes/{cpfOuCnpj}" $status
echo "$response" | jq '.' || echo -e "⚠️ Resposta não é JSON válido:\n$response"

# 5. Testar exclusão (DELETE)
echo "5. Removendo cliente..."
response=$(http --check-status --ignore-stdin DELETE ${API_URL}/clientes/${CPF_TESTE} 2>&1)
status=$?
print_result "DELETE /clientes/{cpfOuCnpj}" $status

# 5.1 Remover o cliente criado no teste mínimo
echo "5.1 Removendo cliente de teste mínimo..."
response=$(http --check-status --ignore-stdin DELETE ${API_URL}/clientes/${CPF_MINIMO} 2>&1)
status=$?
print_result "DELETE /clientes/{cpfOuCnpj}" $status

# 6. Verificar se foi removido
echo "6. Verificando exclusão..."
response=$(http --check-status --ignore-stdin GET ${API_URL}/clientes/${CPF_TESTE} 2>&1)
status=$?
if [ $status -eq 4 ]; then  # HTTPie retorna 4 para 404 Not Found
  echo -e "  ✓ Sucesso: Cliente não encontrado (como esperado)\n"
else
  echo -e "  ✖ Erro: Cliente ainda existe ou erro inesperado (Status: $status)\n"
  echo "$response" | jq '.' || echo -e "Resposta:\n$response"
fi

echo "✅ Testes completos para clientes!"