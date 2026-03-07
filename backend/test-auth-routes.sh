#!/bin/bash

# Cores para saída
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
BASE_URL="http://localhost:3006"
TOKEN=""
USER_ID=""

echo -e "${BLUE}🧪 TESTE DE ROTAS DE AUTENTICAÇÃO${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Função para fazer requisições e mostrar resultado
test_route() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    local expected_status=$5
    
    echo -e "${YELLOW}📝 $description${NC}"
    echo -e "${YELLOW}📍 $method $url${NC}"
    
    if [ -n "$data" ]; then
        echo -e "${YELLOW}📦 Data: $data${NC}"
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url")
    fi
    
    # Separar corpo do status code
    body=$(echo "$response" | sed '$d')
    status_code=$(echo "$response" | tail -n1)
    
    # Verificar status
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ Status: $status_code (Esperado: $expected_status)${NC}"
    else
        echo -e "${RED}❌ Status: $status_code (Esperado: $expected_status)${NC}"
    fi
    
    echo -e "${BLUE}📄 Response: $body${NC}"
    echo -e "${BLUE}----------------------------------------${NC}\n"
    
    # Extrair token se for login/signup
    if [[ "$url" == "/auth/login" || "$url" == "/auth/signup" ]]; then
        TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        USER_ID=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$TOKEN" ]; then
            echo -e "${GREEN}🔑 Token obtido: ${TOKEN:0:20}...${NC}"
            echo -e "${GREEN}👤 User ID: $USER_ID${NC}\n"
        fi
    fi
}

# Testes
echo -e "${BLUE}🚀 Iniciando testes...${NC}\n"

# 1. Signup válido
test_route "POST" "/auth/signup" \
    '{"name":"Test User","email":"test@example.com","password":"123456"}' \
    "Signup - Criar usuário válido" \
    "201"

# 2. Tentar signup com email duplicado
test_route "POST" "/auth/signup" \
    '{"name":"Test User 2","email":"test@example.com","password":"123456"}' \
    "Signup - Email duplicado (deve falhar)" \
    "400"

# 3. Login válido
test_route "POST" "/auth/login" \
    '{"email":"test@example.com","password":"123456"}' \
    "Login - Credenciais válidas" \
    "200"

# 4. Login com email inválido
test_route "POST" "/auth/login" \
    '{"email":"wrong@example.com","password":"123456"}' \
    "Login - Email inválido (deve falhar)" \
    "401"

# 5. Login com senha inválida
test_route "POST" "/auth/login" \
    '{"email":"test@example.com","password":"wrongpass"}' \
    "Login - Senha inválida (deve falhar)" \
    "401"

# 6. Login sem dados
test_route "POST" "/auth/login" \
    '{}' \
    "Login - Sem dados (deve falhar)" \
    "400"

# 7. Edit usuário sem token
test_route "PUT" "/auth/edit" \
    '{"name":"Updated Name"}' \
    "Edit - Sem token (deve falhar)" \
    "401"

# 8. Edit usuário com token válido
if [ -n "$TOKEN" ]; then
    test_route "PUT" "/auth/edit" \
        '{"name":"Updated Name"}' \
        "Edit - Com token válido" \
        "200"
else
    echo -e "${RED}❌ Não foi possível testar edição - token não obtido${NC}\n"
fi

# 9. Delete usuário sem token
test_route "DELETE" "/auth/delete" \
    '' \
    "Delete - Sem token (deve falhar)" \
    "401"

# 10. Delete usuário com token válido
if [ -n "$TOKEN" ]; then
    test_route "DELETE" "/auth/delete" \
        '' \
        "Delete - Com token válido" \
        "200"
else
    echo -e "${RED}❌ Não foi possível testar deleção - token não obtido${NC}\n"
fi

# 11. Tentar login após deletar (soft delete)
test_route "POST" "/auth/login" \
    '{"email":"test@example.com","password":"123456"}' \
    "Login - Usuário deletado (deve falhar)" \
    "401"

echo -e "${BLUE}📊 RESUMO DOS TESTES${NC}"
echo -e "${BLUE}==================${NC}"
echo -e "${GREEN}✅ Rotas que funcionaram corretamente${NC}"
echo -e "${RED}❌ Rotas com problemas${NC}"
echo -e "${YELLOW}⚠️  Verifique os logs detalhados acima${NC}"
echo -e "${BLUE}🔍 Middleware de erro deve tratar os erros Zod${NC}"
echo -e "${BLUE}🔑 Tokens JWT devem ser gerados corretamente${NC}"
echo -e "${BLUE}🗑️  Soft delete deve impedir login posterior${NC}\n"

echo -e "${BLUE}🎯 Testes concluídos!${NC}"
