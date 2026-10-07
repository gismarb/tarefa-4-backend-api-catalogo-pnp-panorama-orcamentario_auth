# API do Panorama Orçamentário da PNP — Autenticação

Este projeto foi desenvolvido como atividade avaliativa da disciplina de Tecnologias Back-End da Pós-Graduação em Desenvolvimento Web e Mobile do IF Sudeste MG.

A entrega evolui a API CRUD anterior com registro e login de usuários, hash de senha com bcrypt e autenticação JWT. As consultas dos indicadores permanecem públicas; criação, atualização e exclusão exigem um usuário autenticado.

Foi preservado o domínio relacionado ao TCC: indicadores do Panorama Orçamentário da Plataforma Nilo Peçanha (PNP). A implementação mantém Node.js, TypeScript, Express, PostgreSQL, Docker, Prisma e Zod.

**Cliente HTTP → Express → autenticação nas rotas protegidas → validação Zod → Prisma → PostgreSQL**

---

## 1. Contexto da Atividade

A tarefa solicita registro e login de usuários, proteção das rotas de escrita por middleware e leitura pública dos dados.

Os requisitos desta entrega são:

- API Node.js + TypeScript + Express;
- model `User` no Prisma;
- `POST /api/auth/register`, criando usuário e retornando token;
- `POST /api/auth/login`, autenticando e retornando token;
- `GET /api/auth/me`, retornando os dados do usuário autenticado;
- e-mail válido e senha de pelo menos seis caracteres no registro, validados por Zod;
- senha persistida como hash bcrypt;
- JWT com segredo em `.env` e expiração;
- middleware que rejeita token ausente, inválido ou expirado com `401`;
- operações `POST`, `PUT` e `DELETE` protegidas;
- consultas `GET` dos indicadores públicas;
- testes de sucesso e erro no Insomnia;
- código público no GitHub, `.env.example` e README reproduzível;
- demonstração de 2–5 minutos, exibindo Prisma Studio, Insomnia e o fluxo de autenticação.

O enunciado utiliza `/api/products`. Nesta evolução do projeto anterior, a entidade continua sendo `BudgetIndicator`, com rotas `/api/budget-indicators`, aplicando a mesma regra de proteção ao domínio PNP.

Qualquer usuário cadastrado e autenticado pode alterar qualquer indicador. Esta atividade não define perfis administrativos nem propriedade dos registros.

---

## 2. Relação com o TCC

Este projeto utiliza como domínio uma parte do contexto do TCC, atualmente direcionado à construção de um **portal Web para gestão de dados educacionais**, tendo a Plataforma Nilo Peçanha como uma das fontes de dados previstas.

Dentro desse contexto, o Panorama Orçamentário representa um conjunto de informações que pode ser utilizado futuramente em processos de:

- ingestão;
- tratamento;
- consolidação;
- persistência;
- análise;
- consulta;
- construção de indicadores;
- disponibilização por APIs;
- visualização em painéis.

A atividade não representa a arquitetura final do TCC. Ela funciona como um exercício isolado de back-end, persistência, validação e disponibilização de dados por API REST.

---

## 3. Descrição da Solução Implementada

O projeto mantém o CRUD de indicadores e acrescenta autenticação.

| Operação | Fluxo |
|---|---|
| Registro | Zod → verificar e-mail → bcrypt → salvar usuário → emitir JWT |
| Login | Zod → buscar usuário → comparar senha com hash → emitir JWT |
| Rota protegida | Extrair Bearer → verificar JWT → consultar usuário → continuar rota |
| Escrita de indicador | Autenticar → validar ID/payload → executar operação Prisma |
| Leitura de indicador | Consultar pelo Prisma, sem exigir token |

As respostas de autenticação incluem somente `id`, `email` e `name` do usuário. Senha e hash não são retornados.

O CRUD preserva IDs inteiros positivos, validação Zod, rejeição de campos desconhecidos, atualização parcial não vazia, valores monetários não negativos e tratamento de recurso inexistente.

---

## 4. Tecnologias Utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| Node.js | Ambiente de execução da aplicação back-end |
| TypeScript | Tipagem, organização e compilação do código |
| Express | Criação do servidor HTTP e definição das rotas REST |
| CORS | Restrição da origem autorizada a consumir a API no navegador |
| Zod | Validação de indicadores e credenciais em tempo de execução |
| bcryptjs 3 | Hash da senha e comparação no login |
| jsonwebtoken 9 | Emissão e verificação de JWT |
| @types/jsonwebtoken | Tipagem TypeScript da biblioteca JWT |
| PostgreSQL 15 | Banco de dados relacional |
| PostgreSQL 15 Alpine | Imagem Docker utilizada para o banco |
| Docker | Execução isolada do PostgreSQL |
| Docker Compose | Definição e orquestração do serviço PostgreSQL |
| Prisma ORM 7.10 | Modelagem, migrations, seed e acesso tipado ao banco |
| Prisma Client | Operações CRUD no PostgreSQL a partir do TypeScript |
| `@prisma/adapter-pg` | Adapter utilizado pelo Prisma 7 para conexão direta com PostgreSQL |
| `pg` | Driver PostgreSQL utilizado pelo adapter |
| dotenv | Leitura das variáveis de ambiente |
| TSX | Execução de TypeScript em desenvolvimento e no seed |
| Prisma Studio | Inspeção visual dos dados persistidos |
| Insomnia | Testes manuais dos endpoints e cenários de erro |
| Git | Versionamento local |
| GitHub | Hospedagem do código-fonte |

---

## 5. Requisitos da Atividade e Onde Foram Atendidos

| Requisito | Implementação |
|---|---|
| Express + TypeScript | `src/server.ts`, `package.json` e `tsconfig.json` |
| Prisma + PostgreSQL | `src/lib/prisma.ts`, `prisma.config.ts` e `prisma/schema.prisma` |
| Usuário persistido | Model `User`, tabela `users` e migration `20261005012954_create_users` |
| Registro e login | `src/routes/auth.routes.ts` |
| Consulta do usuário autenticado | `GET /api/auth/me` |
| Validação de credenciais | `src/schemas/auth.schema.ts` |
| Hash e comparação de senha | `bcrypt.hash(password, 10)` e `bcrypt.compare` |
| Segredo no ambiente | `JWT_SECRET` em `.env`, documentada em `.env.example` |
| JWT com expiração de 7 dias | `src/utils/jwt.ts` |
| Middleware de autenticação | `src/middlewares/auth.middleware.ts` |
| Escrita protegida | Middleware em POST, PUT e DELETE de `/api/budget-indicators` |
| Consultas públicas | GET de listagem e consulta por ID |
| CORS com Authorization | `allowedHeaders` em `src/server.ts` |
| CRUD e validações preservados | Schema de indicadores e utilitários HTTP |
| Persistência isolada | `docker-compose.yml`, banco e volume próprios |
| Testes obrigatórios | Coleção em `insomnia/api-panorama-orcamentario-pnp.yaml` |
| Instalação e payloads | Seções 10, 11 e 14 deste README |

---

## 6. Modelo de Dados

O modelo principal da aplicação é `BudgetIndicator`.

```prisma
model BudgetIndicator {
  id                Int      @id @default(autoincrement())
  year              Int
  institutionCode   String   @map("institution_code")
  institutionName   String   @map("institution_name")
  region            String
  state             String
  stateCode         String   @map("state_code")
  updatedBudget     Decimal  @map("updated_budget") @db.Decimal(18, 2)
  committedExpense  Decimal  @map("committed_expense") @db.Decimal(18, 2)
  liquidatedExpense Decimal  @map("liquidated_expense") @db.Decimal(18, 2)
  paidExpense       Decimal  @map("paid_expense") @db.Decimal(18, 2)
  availableCredit   Decimal  @map("available_credit") @db.Decimal(18, 2)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("budget_indicators")
}
```

### 6.1. Convenção de nomes

Foi utilizada separação entre a nomenclatura da aplicação e a nomenclatura física do banco.

No TypeScript e no Prisma é utilizado `camelCase`:

```text
institutionCode
updatedBudget
createdAt
```

No PostgreSQL é utilizado `snake_case`:

```text
institution_code
updated_budget
created_at
```

O mapeamento é realizado pelo Prisma com `@map`.

O nome do model também é separado do nome físico da tabela com:

```prisma
@@map("budget_indicators")
```

Dessa forma:

```text
Prisma / TypeScript: BudgetIndicator
PostgreSQL:          budget_indicators
```

### 6.2. Valores monetários

Os campos financeiros utilizam:

```prisma
Decimal @db.Decimal(18, 2)
```

No PostgreSQL, esses campos são criados como:

```text
numeric(18,2)
```

O tipo foi escolhido para evitar o uso de ponto flutuante como representação persistida de valores monetários.

No seed, os valores são fornecidos como strings numéricas:

```ts
updatedBudget: "416480326.62"
```

Ao serializar o resultado em JSON, valores `Decimal` podem aparecer como strings:

```json
{
  "updatedBudget": "416480326.62"
}
```

Isso não significa que a coluna seja textual. No PostgreSQL, ela permanece armazenada como `numeric(18,2)`.

### 6.3. Usuários

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  name         String?
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

O e-mail é normalizado com remoção de espaços externos e conversão para minúsculas no registro e no login. A senha é preservada exatamente como recebida.

O nome é opcional. Quando informado, deve conter de 1 a 255 caracteres após a remoção de espaços externos. Os schemas rejeitam campos desconhecidos. O registro exige senha com pelo menos seis caracteres; o login exige senha não vazia. Ambos limitam a senha a 72 bytes em UTF-8, evitando truncamento pelo bcrypt.

Não há relação de propriedade entre `User` e `BudgetIndicator` nesta atividade.

---

## 7. Origem e Preparação dos Dados

Os dados utilizados no seed foram obtidos a partir do arquivo `PanoramaOrcamentario.csv`, utilizado como fonte de trabalho da atividade anterior.

O arquivo original possui estrutura analítica e granularidade superior à necessária para uma API CRUD acadêmica. Para manter o projeto compatível com o objetivo da disciplina, foi criada uma amostra consolidada.

### 7.1. Critérios da amostra

Foram utilizados:

- ano de referência: **2025**;
- uma instituição de cada região do Brasil;
- registros relacionados a **Órgão da UO**;
- consolidação dos valores financeiros por instituição;
- cinco registros finais no seed.

| Região | Instituição | Código |
|---|---|---|
| Centro-Oeste | Instituto Federal de Brasília | IFB |
| Nordeste | Instituto Federal da Bahia | IFBA |
| Norte | Instituto Federal do Pará | IFPA |
| Sudeste | Instituto Federal do Sudeste de Minas Gerais | IF SUDESTE MG |
| Sul | Instituto Federal de Santa Catarina | IFSC |

O seed utiliza `TRUNCATE TABLE ... RESTART IDENTITY` antes da inserção. Assim, cada execução restaura os cinco registros com IDs de `1` a `5` e evita duplicações.

> O seed é destinado ao ambiente acadêmico de desenvolvimento. Sua execução remove os registros existentes da tabela antes de recriar a amostra.

---

## 8. Estrutura Principal do Projeto

```text
tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_auth/
├── insomnia/
│   └── api-panorama-orcamentario-pnp.yaml
├── prisma/
│   ├── migrations/
│   │   ├── 20260826220140_init/
│   │   └── 20261005012954_create_users/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── generated/prisma/
│   ├── lib/prisma.ts
│   ├── middlewares/auth.middleware.ts
│   ├── routes/auth.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── budget-indicator.schema.ts
│   ├── utils/
│   │   ├── http.ts
│   │   └── jwt.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
├── LICENSE
└── README.md
```

`node_modules/`, `dist/`, `.env` e `src/generated/` são locais ou gerados e não são versionados.

---

## 9. Arquivos Principais

| Arquivo | Responsabilidade |
|---|---|
| `src/server.ts` | Inicializa Express, CORS, JSON, router de autenticação e CRUD; aplica middleware às escritas |
| `src/lib/prisma.ts` | Centraliza Prisma Client e adapter PostgreSQL |
| `src/routes/auth.routes.ts` | Registro, login e consulta `/me` |
| `src/middlewares/auth.middleware.ts` | Verifica Bearer e JWT, consulta usuário e preenche `request.user` |
| `src/schemas/auth.schema.ts` | Valida credenciais e nome, normaliza e-mail e rejeita campos desconhecidos |
| `src/schemas/budget-indicator.schema.ts` | Mantém validações de criação e atualização dos indicadores |
| `src/utils/http.ts` | Valida IDs recebidos como `unknown` e formata issues Zod |
| `src/utils/jwt.ts` | Carrega segredo obrigatório, emite e verifica JWT HS256 |
| `prisma/schema.prisma` | Define `BudgetIndicator` e `User` |
| `prisma/migrations/` | Histórico SQL de criação das tabelas |
| `prisma/seed.ts` | Restaura somente os cinco indicadores de demonstração |
| `prisma.config.ts` | Configuração da CLI, migrations, seed e URL do banco |
| `docker-compose.yml` | PostgreSQL 15 Alpine na porta de host 5434, com banco e volume próprios |
| `insomnia/` | Coleção de testes exportada com tokens vazios no ambiente |

---

## 10. Endpoints da API

A API utiliza por padrão:

```text
http://localhost:3003
```

| Método | Endpoint | Resultado principal |
|---|---|---|
| `POST` | `/api/auth/register` | Registra usuário e retorna token (`201`) |
| `POST` | `/api/auth/login` | Autentica usuário e retorna token (`200`) |
| `GET` | `/api/auth/me` | Retorna usuário autenticado (`200`) |
| `GET` | `/` | Verifica o status da API |
| `GET` | `/api/budget-indicators` | Lista os indicadores |
| `GET` | `/api/budget-indicators/:id` | Consulta um indicador |
| `POST` | `/api/budget-indicators` | Cria um indicador; exige token |
| `PUT` | `/api/budget-indicators/:id` | Atualiza parcialmente; exige token |
| `DELETE` | `/api/budget-indicators/:id` | Exclui um indicador; exige token |

### 10.1. Status

```http
GET /
```

Retorno `200 OK`:

```json
{
  "status": "ok",
  "message": "API do Panorama Orçamentário da PNP em execução"
}
```

### 10.2. Listar indicadores

```http
GET /api/budget-indicators
```

Retorna `200 OK` com todos os registros armazenados.

### 10.3. Buscar indicador por ID

```http
GET /api/budget-indicators/1
```

Retorna `200 OK` com um indicador específico.

Um ID inexistente retorna `404 Not Found`. Um ID que não seja inteiro positivo retorna `400 Bad Request`.

### 10.4. Criar indicador

```http
POST /api/budget-indicators
Authorization: Bearer <token>
Content-Type: application/json
```

Exemplo de payload:

```json
{
  "year": 2025,
  "institutionCode": "IFSULDEMINAS",
  "institutionName": "Instituto Federal do Sul de Minas Gerais",
  "region": "Sudeste",
  "state": "Minas Gerais",
  "stateCode": "MG",
  "updatedBudget": 520000000.5,
  "committedExpense": 490000000.25,
  "liquidatedExpense": 450000000.1,
  "paidExpense": 420000000,
  "availableCredit": 30000000.25
}
```

Retorna `201 Created`. Um payload inválido retorna `400 Bad Request` com a lista de campos e mensagens produzidas pelo Zod.

### 10.5. Atualizar parcialmente

```http
PUT /api/budget-indicators/6
Authorization: Bearer <token>
Content-Type: application/json
```

Exemplo:

```json
{
  "availableCredit": 31000000.5
}
```

O schema de atualização é parcial. Apenas os campos enviados são alterados.

Retornos possíveis:

- `200 OK` para atualização concluída;
- `400 Bad Request` para ID ou payload inválido;
- `404 Not Found` para registro inexistente;
- `500 Internal Server Error` para falha inesperada.

### 10.6. Excluir indicador

```http
DELETE /api/budget-indicators/6
Authorization: Bearer <token>
```

Retorna `204 No Content` sem corpo. Um registro inexistente retorna `404 Not Found`.

### 10.7. Exemplo de erro de validação

```json
{
  "error": "Payload inválido.",
  "issues": [
    {
      "path": "paidExpense",
      "message": "O valor da despesa paga não pode ser negativo."
    }
  ]
}
```

### 10.8. Registro

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "gismar@example.com",
  "password": "abc123",
  "name": "Gismar"
}
```

O campo `name` pode ser omitido. A senha acima é apenas um dado de demonstração acadêmica.

Resposta `201 Created`:

```json
{
  "message": "Usuário cadastrado com sucesso.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "gismar@example.com",
    "name": "Gismar"
  }
}
```

E-mail duplicado retorna `409` com `"O e-mail informado já está em uso."`. A restrição única também cobre tentativas simultâneas, pelo tratamento de `P2002`. Payload inválido retorna `400` com `issues`.

### 10.9. Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "gismar@example.com",
  "password": "abc123"
}
```

Resposta `200 OK`:

```json
{
  "message": "Login realizado com sucesso.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "gismar@example.com",
    "name": "Gismar"
  }
}
```

Senha incorreta ou e-mail inexistente retorna `401` com `"E-mail ou senha incorretos."`. Dados que não passam no schema retornam `400`.

### 10.10. Usuário autenticado

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Resposta `200 OK`:

```json
{
  "message": "Usuário autenticado.",
  "user": {
    "id": 1,
    "email": "gismar@example.com",
    "name": "Gismar"
  }
}
```

Quando o nome é omitido no registro, as respostas apresentam `"name": null`.

### 10.11. Erros de autenticação

| Situação | Status | Mensagem |
|---|---|---|
| Sem Authorization | `401` | Token de acesso não fornecido. |
| Cabeçalho fora do formato Bearer | `401` | Use Authorization: Bearer <token>. |
| JWT inválido ou ainda não válido | `401` | Token inválido. |
| JWT expirado | `401` | Token expirado. |
| Usuário do JWT inexistente | `401` | Usuário do token não encontrado. |
| Falha interna ao autenticar | `500` | Erro interno ao verificar a autenticação. |

O middleware executa antes da validação dos indicadores. Portanto, para testar erros `400` ou `404` nas escritas, envie um token válido.

---

## 11. Como Executar o Projeto do Zero

### 11.1. Pré-requisitos

É necessário possuir:

- Node.js;
- npm;
- Docker;
- Docker Compose.

O Prisma, TSX, TypeScript e demais dependências são instalados pelo `npm ci`, respeitando o arquivo de lock.

### 11.2. Clonar o repositório

Após a publicação deste projeto no GitHub:

```bash
git clone https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_auth.git
```

### 11.3. Entrar no diretório

```bash
cd tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_auth
```

### 11.4. Instalar as dependências

```bash
npm ci
```

### 11.5. Criar o arquivo de ambiente

```bash
cp .env.example .env
```

Configuração local prevista:

```env
DATABASE_URL="postgresql://pnp_user:pnp_password@localhost:5434/pnp_panorama_auth?schema=public"
PORT=3003
ALLOWED_ORIGIN="http://localhost:5173"
JWT_SECRET=""
```

Antes de iniciar a API, gere o segredo JWT. O comando abaixo substitui a linha `JWT_SECRET` no `.env`, sem exibir o segredo:

```bash
node --input-type=module <<'JS'
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const content = readFileSync(".env", "utf8");
const line = `JWT_SECRET="${randomBytes(32).toString("hex")}"`;
const updated = /^JWT_SECRET=.*$/m.test(content)
  ? content.replace(/^JWT_SECRET=.*$/m, line)
  : `${content.trimEnd()}\n${line}\n`;

writeFileSync(".env", updated);
console.log("JWT_SECRET configurada.");
JS
```

Gere uma vez durante a configuração. Trocar o segredo invalida os tokens emitidos com o valor anterior. Ao carregar o utilitário JWT, a aplicação lança um erro se o segredo estiver ausente ou vazio.

O `.env` real não é versionado.

### 11.6. Subir o PostgreSQL

```bash
docker compose up -d
docker compose ps
```

### 11.7. Gerar o Prisma Client

```bash
npm run prisma:generate
```

O client é gerado em:

```text
src/generated/prisma/
```

### 11.8. Aplicar as migrations

Como as duas migrations já são versionadas, pode ser utilizado:

```bash
npx prisma migrate deploy
```

Durante o desenvolvimento de alterações no schema:

```bash
npm run prisma:migrate -- --name nome_da_migration
```

### 11.9. Popular o banco

```bash
npm run seed
```

> O seed limpa a tabela `budget_indicators`, reinicia a sequência de IDs e recria os cinco registros da amostra.

### 11.10. Conferir os dados com Prisma Studio

```bash
npm run prisma:studio
```

O model `BudgetIndicator` deve apresentar cinco registros com IDs de `1` a `5`. A tabela `users` começa vazia; cadastre um usuário pela API. O seed não cria nem remove usuários.

### 11.11. Executar a API em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3003
```

---

## 12. Scripts Disponíveis

| Script | Função |
|---|---|
| `npm run dev` | Executa o servidor com TSX em modo watch |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa a versão JavaScript compilada |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Cria ou aplica migrations em desenvolvimento |
| `npm run prisma:studio` | Abre o Prisma Studio |
| `npm run seed` | Restaura e popula a tabela com cinco registros |

Comandos Prisma adicionais:

```bash
npx prisma validate
npx prisma format
npx prisma migrate deploy
npx prisma db seed
```

---

## 13. Build e Execução Compilada

Para validar a compilação TypeScript:

```bash
npm run build
```

Os arquivos JavaScript são gerados em:

```text
dist/
```

Para executar a aplicação compilada:

```bash
npm start
```

O fluxo fica:

```text
src/*.ts -> npm run build -> dist/*.js -> npm start -> Node.js
```

---

## 14. Testes com Insomnia

Importe a coleção versionada em:

```text
insomnia/api-panorama-orcamentario-pnp.yaml
```

O ambiente exportado possui:

```json
{
  "base_url": "http://localhost:3003",
  "auth_token": "",
  "expired_token": ""
}
```

As credenciais usadas nos payloads são dados de demonstração. Os tokens ficam vazios na exportação e devem ser preenchidos localmente.

### 14.1. Sequência para reproduzir

1. Execute migrations e seed no banco de desenvolvimento. O seed apaga os indicadores e recria a amostra; preserva os usuários.
2. Faça o registro válido. Se o e-mail já existir, use o login ou escolha outro e-mail para demonstrar o registro.
3. Confira no Prisma Studio o usuário e seu `password_hash`, diferente da senha original.
4. Execute login válido e copie o token para `auth_token` no ambiente.
5. Execute `/me` sem token, com token e com token inválido.
6. Consulte e liste indicadores sem token.
7. Execute criação sem token (`401`) e depois com token (`201`). Anote o ID retornado.
8. Use esse ID nas URLs de atualização e exclusão. Teste primeiro sem token (`401`) e depois com token (`200` / `204`).
9. Após excluir, repita uma operação autenticada sobre esse ID para demonstrar `404`.
10. Execute os casos de dados inválidos com um token válido, para alcançar as validações Zod e de ID.

As URLs da coleção podem conter o ID `6`, usado na validação inicial. O ID será `6` após restaurar a amostra e realizar a primeira criação, mas pode variar em execuções posteriores. Ajuste as URLs ao ID efetivamente retornado. O seed não deve ser executado entre a criação e os testes que dependem desse registro.

### 14.2. Configuração da autenticação

Nas requisições autenticadas, configure **Auth → Bearer Token**:

```text
{{ _.auth_token }}
```

Cole somente o JWT na variável; o Insomnia acrescenta o esquema Bearer. Não adicione um segundo cabeçalho Authorization manualmente.

As requisições antigas de escrita também usam a variável para testar as validações do CRUD. Os testes chamados “sem token” ficam com **Auth → None** e sem Authorization ativo. Registro, login e consultas dos indicadores são públicos.

### 14.3. Token expirado

Gere um JWT de teste já expirado no terminal, a partir da pasta do projeto:

```bash
node --input-type=module <<'JS'
import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET não definida.");
}

console.log(jwt.sign(
  { userId: 1 },
  secret,
  { algorithm: "HS256", expiresIn: -1 },
));
JS
```

Copie o resultado para `expired_token`. Em **Auth — Me com token expirado**, o campo Bearer Token usa `{{ _.expired_token }}`. O retorno esperado é `401`, com `"Token expirado."`. A duração normal dos tokens da API permanece em sete dias.

### 14.4. Cenários principais

| Cenário | Resultado esperado |
|---|---|
| Registro válido, inclusive sem nome | `201`, token e usuário |
| E-mail duplicado | `409` |
| Registro com e-mail/senha inválidos | `400`, issues Zod |
| Login válido | `200`, token e usuário |
| Senha incorreta ou e-mail inexistente | `401` |
| Login com e-mail inválido e senha vazia | `400` |
| `/me` sem token | `401` |
| `/me` com token válido | `200` |
| `/me` com token inválido | `401` |
| `/me` com token expirado | `401` |
| Listagem e consulta sem token | `200` |
| POST, PUT e DELETE sem token | `401` em cada método |
| POST, PUT e DELETE com token | `201`, `200` e `204` |
| Atualização autenticada com valor negativo | `400` |
| Atualização autenticada com ID inválido | `400` |
| Atualização autenticada de registro inexistente | `404` |

A coleção também preserva cenários anteriores, como atualização vazia, exclusão inexistente e ID inválido na exclusão. Antes de uma nova exportação, deixe `auth_token` e `expired_token` vazios.

---

## 15. Validações Realizadas

A implementação foi validada localmente por etapas:

- instalação das dependências com `npm ci`;
- geração do Prisma Client e build TypeScript;
- execução compilada da base antes de acrescentar autenticação;
- configuração Docker, aplicação das duas migrations e seed de cinco indicadores;
- emissão/verificação de JWT válido e rejeição de token adulterado no utilitário;
- schemas de usuário, incluindo e-mail normalizado, senha curta, limite em bytes, nome vazio e campos desconhecidos;
- registro e login no Insomnia, com casos de sucesso e erro;
- inspeção do usuário e hash no Prisma Studio;
- `/me` sem token, com token válido, inválido e expirado;
- POST, PUT e DELETE sem e com autenticação;
- consultas públicas por ID e listagem;
- validação autenticada de valor negativo, ID inválido e registro inexistente;
- uso da variável `auth_token` em `/me`;
- conferência de alterações por `git diff --check` e commits por etapa.

Comandos usuais para reproduzir verificações:

```bash
docker compose config --quiet
docker compose ps
npx prisma migrate status
npm run build
git diff --check
```

A autorização do cabeçalho `Authorization` foi adicionada ao CORS. Os testes no Insomnia não substituem uma verificação de preflight em navegador. A execução compilada com o fluxo completo de autenticação deve ser conferida no fechamento da entrega.

---

## 16. Decisões de Desenvolvimento

### 16.1. Evolução em projeto independente

O projeto foi criado a partir da atividade CRUD anterior [tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud](https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud), mas recebeu um novo repositório Git, novo container, novo banco, novo volume e portas próprias. Essa separação preserva a entrega anterior e permite executar as duas aplicações sem compartilhar estado.

### 16.2. Portas 3003 e 5434

A API utiliza a porta `3003`, enquanto o PostgreSQL é publicado em `5434` no computador e continua usando `5432` dentro do container.

As portas foram verificadas antes da configuração e evitam conflito com a API CRUD anterior, que utiliza `3002` e `5433`.

### 16.3. Entidade equivalente ao produto

Foi mantido `BudgetIndicator` para continuar o domínio PNP da atividade anterior. O enunciado atual usa `products`; neste projeto, a proteção equivalente foi aplicada a `/api/budget-indicators`.

### 16.4. Política de CORS

A origem permitida é definida por:

```env
ALLOWED_ORIGIN="http://localhost:5173"
```

Também foram declarados os métodos `GET`, `POST`, `PUT` e `DELETE` e os headers `Content-Type` e `Authorization`.

O CORS controla o acesso realizado por navegadores. Ele não substitui autenticação, autorização ou regras de firewall.

### 16.5. Validação com Zod

O TypeScript valida tipos durante o desenvolvimento, mas não garante que o JSON recebido em execução possua os tipos esperados.

O Zod foi utilizado para validar o conteúdo real de `request.body`, produzir mensagens claras e impedir que dados inválidos sejam enviados ao Prisma.

### 16.6. Atualização parcial com PUT

O endpoint `PUT` preserva o schema criado com `.partial()` na atividade CRUD anterior. Assim, todos os campos tornam-se opcionais durante a atualização, mas uma validação adicional exige que pelo menos um campo seja informado.

### 16.7. Tratamento do P2025

O Prisma pode lançar `PrismaClientKnownRequestError` com código `P2025` quando uma operação de atualização ou exclusão não encontra o registro solicitado.

A API converte esse erro em:

```text
404 Not Found
```

### 16.8. Prisma 7.10.0

Foram mantidos Prisma CLI e Prisma Client na versão `7.10.0`, preservando a configuração e o funcionamento já validados na atividade anterior.

O material da aula utiliza Prisma 6. Por isso, conceitos e operações foram aproveitados, mas a configuração não foi copiada diretamente.

### 16.9. Driver adapter do Prisma 7

Para a conexão direta com PostgreSQL foram utilizados:

```text
@prisma/adapter-pg
pg
```

A configuração permanece centralizada em `src/lib/prisma.ts`.

### 16.10. Prisma Client gerado dentro de `src/`

O Prisma Client é gerado em:

```text
src/generated/prisma/
```

Isso mantém os arquivos necessários à compilação dentro do `rootDir` configurado no TypeScript. O diretório não é versionado e pode ser recriado com `npm run prisma:generate`.

### 16.11. Uso de `@map` e `@@map`

Foi mantida a convenção:

```text
TypeScript / Prisma -> camelCase
PostgreSQL          -> snake_case
```

### 16.12. Uso de Decimal

Valores financeiros foram definidos como `Decimal(18,2)` em vez de tipos de ponto flutuante na camada de persistência.

### 16.13. Seed reproduzível

O seed limpa a tabela e reinicia a sequência de IDs antes da inserção. Isso produz sempre uma base conhecida para a demonstração no Prisma Studio e no Insomnia.

### 16.14. `.env` e `.env.example`

O `.env` contém a configuração local e não é versionado. O `.env.example` documenta as variáveis necessárias sem armazenar dados locais fora do ambiente de desenvolvimento.

### 16.15. Autenticação proporcional à atividade

O registro é público e todos os usuários autenticados possuem a mesma permissão de escrita. Não foram acrescentados perfis, gestão de usuários, recuperação de senha ou vínculo de autoria nos indicadores.

### 16.16. bcrypt e JWT

Foi usado `bcryptjs`, como na aula, com custo 10. O banco armazena `passwordHash`; o JWT contém `userId` e os campos temporais emitidos pela biblioteca. A senha não entra no token.

Os tokens são assinados com HS256 e expiram em sete dias. A verificação aceita explicitamente HS256, valida o identificador e consulta a existência do usuário. O segredo é obrigatório em `.env`, em vez de fixo no código.

### 16.17. Ajuste da tipagem dos IDs

Ao inserir o middleware nas rotas, a inferência dos parâmetros do Express passou a incluir `string[]`. O utilitário `parsePositiveIntegerId` recebe `unknown` e valida o tipo antes da conversão, preservando a rejeição de arrays, IDs inválidos e números inseguros.

---

## 17. Relação com a Aula

O projeto aplica o fluxo da Aula 4 do professor Lucas Grassano Lattari:

- model de usuário e migration;
- registro com hash bcrypt;
- login com comparação de senha;
- emissão e verificação de JWT;
- middleware que consulta o usuário e o associa à requisição;
- rota `/me` protegida;
- leitura pública e escrita autenticada.

O código da aula utiliza Prisma 6 e centraliza a implementação em `server.ts`. Nesta entrega foram mantidos Prisma 7, adapter PostgreSQL, imports ESM e schemas/utilitários separados da base anterior. A autenticação foi organizada em router e middleware próprios.

A aula também demonstra integração React e armazenamento de tokens no frontend. Esta entrega se concentra na API e no Insomnia; não inclui frontend.

---

## 18. Segurança e Arquivos Não Versionados

O `.gitignore` evita o versionamento de:

```text
node_modules/
dist/
.env
src/generated/
```

### `node_modules/`

É recriado por `npm ci`.

### `dist/`

É recriado por `npm run build`.

### `.env`

Contém a configuração local e deve ser recriado a partir de `.env.example`.

### `src/generated/`

Contém o Prisma Client gerado por `npm run prisma:generate`.

### Limites desta autenticação

A aplicação não implementa refresh token, revogação individual, endpoint de logout, recuperação de senha, verificação de e-mail, perfis de acesso ou limitação de tentativas de login. Os tokens permanecem válidos até expirar, enquanto o usuário existir e o segredo não mudar.

O cadastro público permite que qualquer pessoa se registre e obtenha permissão de escrita, conforme o escopo acadêmico definido. Em uma aplicação com edição restrita a gestores, seriam necessárias regras adicionais de autorização e de concessão de acesso.

CORS controla o consumo por navegadores; a autenticação é feita pelo middleware. O JWT é assinado, e seu conteúdo não deve ser tratado como confidencial.

### Auditoria de dependências

Foi executado `npm audit` durante a revisão. Na instalação da base desta evolução, o npm reportou cinco vulnerabilidades de severidade alta. O diagnóstico da atividade anterior já havia identificado dependências transitivas, inclusive componentes internos do Prisma CLI. Como esta aplicação possui finalidade acadêmica, execução local e versões já validadas para a atividade, a substituição forçada ou o downgrade do Prisma ficaram fora do escopo.

Em um ambiente profissional, os alertas deveriam ser reavaliados continuamente, com atualização controlada, testes de regressão e política de manutenção de dependências.

---

## 19. Observação sobre o Projeto de TCC

Esta API não representa a implementação final do TCC.

Ela funciona como um experimento acadêmico que aplica conceitos de back-end a um domínio relacionado ao projeto maior.

Uma arquitetura futura poderá incluir:

- ingestão automatizada de dados da PNP;
- outras fontes educacionais;
- pipelines de tratamento e consolidação;
- persistência de conjuntos completos;
- autorização por perfis e governança de acesso;
- filtros e paginação;
- consultas analíticas;
- dashboards;
- exportação;
- diferentes perfis de acesso;
- organização em camadas ou módulos;
- infraestrutura conteinerizada com múltiplos serviços.

Essas possibilidades não fazem parte do escopo desta atividade.

---

## 20. Autor

**Gismar Pereira Barbosa**

Pós-Graduação em Desenvolvimento Web e Mobile
IF Sudeste MG

GitHub: https://github.com/gismarb

---

## 21. Referências Técnicas

As decisões e os comandos utilizados foram baseados no material da disciplina e em documentação técnica oficial.

### Material da disciplina

- Repositório da Aula 4 - Tecnologias Back-End:
  https://github.com/lucaslattari/tec_back_end_aula4

- Vídeo da Aula 4 - Autenticação e segurança:
  https://www.youtube.com/watch?v=RLKY6L5Lkdg

- Projeto desenvolvido na atividade anterior:
  https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud

### Node.js

- Node.js Documentation:
  https://nodejs.org/docs/latest/api/

- ECMAScript Modules:
  https://nodejs.org/api/esm.html

### TypeScript

- TypeScript Documentation:
  https://www.typescriptlang.org/docs/

- TSConfig Reference:
  https://www.typescriptlang.org/tsconfig/

### Express e CORS

- Express Documentation:
  https://expressjs.com/

- Express Routing:
  https://expressjs.com/en/guide/routing.html

- Middleware CORS:
  https://www.npmjs.com/package/cors

### bcrypt e JWT

- bcryptjs (implementação usada na aula):
  https://github.com/dcodeIO/bcrypt.js

- jsonwebtoken:
  https://github.com/auth0/node-jsonwebtoken

### Zod

- Zod Documentation:
  https://zod.dev/

### Docker

- Docker Documentation:
  https://docs.docker.com/

- Docker Compose:
  https://docs.docker.com/compose/

- Docker Hub - PostgreSQL:
  https://hub.docker.com/_/postgres

### PostgreSQL

- PostgreSQL 15 Documentation:
  https://www.postgresql.org/docs/15/

- Numeric Types:
  https://www.postgresql.org/docs/15/datatype-numeric.html

### Prisma ORM

- Prisma ORM Documentation:
  https://www.prisma.io/docs/

- Prisma ORM 7:
  https://www.prisma.io/docs/orm/v7

- PostgreSQL Quickstart - Prisma 7:
  https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql

- Upgrade to Prisma ORM 7:
  https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7

- Prisma Migrate:
  https://www.prisma.io/docs/orm/prisma-migrate

- Seeding:
  https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

- Database mapping (`@map` / `@@map`):
  https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping

### Insomnia

- Insomnia Documentation:
  https://developer.konghq.com/insomnia/

- Import and Export:
  https://developer.konghq.com/insomnia/import-export/

- Environments:
  https://developer.konghq.com/insomnia/environments/

---

## 22. Licença

A licença do projeto é definida pelo arquivo [`LICENSE`](LICENSE) presente no repositório.
