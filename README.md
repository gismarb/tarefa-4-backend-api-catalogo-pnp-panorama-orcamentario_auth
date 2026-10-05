# API CRUD do Panorama Orçamentário da PNP

Este projeto foi desenvolvido como atividade avaliativa da disciplina de Tecnologias Back-End da Pós-Graduação em Desenvolvimento Web e Mobile do IF Sudeste MG.

A atividade propõe a evolução de uma API back-end construída com Node.js, TypeScript, Express, PostgreSQL, Docker e Prisma para implementar um CRUD completo, com validação em tempo de execução por Zod, política de CORS e testes de sucesso e erro no Insomnia.

Em vez de utilizar um catálogo convencional de produtos, foi mantido um domínio relacionado ao projeto de TCC: um catálogo de indicadores do Panorama Orçamentário da Plataforma Nilo Peçanha (PNP).

A solução demonstra o fluxo completo:

**cliente HTTP → CORS → API Express → validação Zod → Prisma ORM → PostgreSQL em container Docker**

---

## 1. Contexto da Atividade

A atividade solicita a evolução da API desenvolvida anteriormente para disponibilizar operações completas de criação, leitura, atualização e exclusão de dados.

Os principais requisitos são:

- projeto Node.js com TypeScript;
- servidor Express funcional;
- Prisma conectado ao PostgreSQL;
- PostgreSQL executado por Docker Compose;
- CRUD completo de produtos ou entidade equivalente;
- prefixo `/api` nas rotas da entidade;
- validação de payloads em tempo de execução com Zod;
- schema de atualização parcial criado com `.partial()`;
- política de CORS restrita ao front-end local;
- variáveis `DATABASE_URL`, `PORT` e `ALLOWED_ORIGIN` no ambiente;
- respostas HTTP `200`, `201`, `204`, `400`, `404` e `500`;
- tratamento do erro `P2025` do Prisma;
- seed com pelo menos cinco registros;
- testes de sucesso e erro no Insomnia;
- documentação suficiente para reproduzir a aplicação em outra máquina.

O enunciado permite substituir o domínio de produtos por uma entidade equivalente, especialmente quando relacionada ao projeto de TCC. Por esse motivo, foi mantida a entidade `BudgetIndicator`.

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

A solução implementada consiste em uma API CRUD de indicadores orçamentários da PNP.

O fluxo principal é:

```text
Insomnia / cliente Web
        -> CORS
        -> Express + TypeScript
        -> validação Zod
        -> Prisma Client
        -> @prisma/adapter-pg + pg
        -> PostgreSQL 15 Alpine
        -> volume persistente Docker
```

A API disponibiliza:

- verificação de status;
- listagem dos indicadores cadastrados;
- consulta de indicador por `id`;
- criação de indicador;
- atualização parcial;
- exclusão de indicador;
- validação de IDs inteiros positivos;
- validação dos payloads com Zod;
- rejeição de campos desconhecidos;
- resposta `404` para registro inexistente;
- tratamento do erro `P2025` do Prisma;
- tratamento de erros internos;
- controle de origem com CORS.

Os dados iniciais são carregados por um seed reproduzível e representam uma amostra consolidada do Panorama Orçamentário.

---

## 4. Tecnologias Utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| Node.js | Ambiente de execução da aplicação back-end |
| TypeScript | Tipagem, organização e compilação do código |
| Express | Criação do servidor HTTP e definição das rotas REST |
| CORS | Restrição da origem autorizada a consumir a API no navegador |
| Zod | Validação de payloads em tempo de execução |
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
| Node.js + TypeScript | `package.json`, `tsconfig.json` e arquivos em `src/` |
| Express funcional | `src/server.ts` |
| Prisma + PostgreSQL | `src/lib/prisma.ts`, `prisma/schema.prisma` e `prisma.config.ts` |
| Entidade equivalente ao produto | Model `BudgetIndicator` |
| `GET /` | Rota de status em `src/server.ts` |
| Listagem | `GET /api/budget-indicators` |
| Consulta por `id` | `GET /api/budget-indicators/:id` |
| Criação | `POST /api/budget-indicators` |
| Atualização parcial | `PUT /api/budget-indicators/:id` |
| Exclusão | `DELETE /api/budget-indicators/:id` |
| `201 Created` | Retorno do endpoint `POST` |
| `204 No Content` | Retorno do endpoint `DELETE` |
| ID inválido | Retorno `400` para valores que não sejam inteiros positivos |
| Payload inválido | Tratamento de `ZodError` com retorno `400` |
| Registro inexistente | Retorno `404` nas consultas e tratamento de `P2025` |
| Erro interno | Retorno `500` nas operações com falha inesperada |
| Zod | `src/schemas/budget-indicator.schema.ts` |
| Schema parcial | `updateBudgetIndicatorSchema` criado com `.partial()` |
| CORS restrito | `ALLOWED_ORIGIN` configurada em `src/server.ts` |
| PostgreSQL 15 | Serviço `postgres` em `docker-compose.yml` |
| Porta do PostgreSQL | Mapeamento `5433:5432` |
| Persistência | Volume `postgres_crud_data` |
| Migration inicial | `prisma/migrations/` |
| Seed com cinco registros | `prisma/seed.ts` |
| Variáveis de ambiente | `.env` local e `.env.example` versionado |
| Decimal para valores monetários | `Decimal @db.Decimal(18, 2)` |
| Prisma Studio | Script `npm run prisma:studio` |
| Insomnia | Coleção exportada em `insomnia/` |
| Build TypeScript | `npm run build` |
| Execução compilada | `npm start` |

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
tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud/
├── insomnia/
│   └── api-panorama-orcamentario-pnp.yaml
├── prisma/
│   ├── migrations/
│   │   └── 20260826220140_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   └── prisma.ts
│   ├── schemas/
│   │   └── budget-indicator.schema.ts
│   ├── utils/
│   │   └── http.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

> `node_modules/`, `dist/`, `.env` e `src/generated/` são artefatos locais ou gerados e não são versionados.

---

## 9. Arquivos Principais

### 9.1. `src/server.ts`

Responsável por:

- criar a aplicação Express;
- carregar as variáveis de ambiente;
- configurar CORS e `express.json()`;
- utilizar a porta definida por `PORT`;
- disponibilizar os endpoints REST;
- executar as operações CRUD pelo Prisma Client;
- validar IDs;
- aplicar os schemas Zod;
- tratar erros `400`, `404` e `500`;
- iniciar o servidor HTTP.

### 9.2. `src/lib/prisma.ts`

Centraliza a criação do Prisma Client.

O arquivo:

- carrega `DATABASE_URL`;
- cria o `PrismaPg`;
- utiliza `@prisma/adapter-pg`;
- cria uma instância reutilizável de `PrismaClient`.

### 9.3. `src/schemas/budget-indicator.schema.ts`

Define:

- campos obrigatórios na criação;
- tipos e tamanhos mínimos;
- regiões brasileiras aceitas;
- formato da sigla do estado;
- validação dos valores monetários;
- rejeição de valores negativos;
- rejeição de campos desconhecidos;
- atualização parcial com `.partial()`;
- rejeição de atualização sem campos.

### 9.4. `src/utils/http.ts`

Centraliza:

- conversão e validação de IDs inteiros positivos;
- rejeição de números inseguros, negativos, decimais e notações inválidas;
- formatação padronizada das issues retornadas pelo Zod.

### 9.5. `prisma/schema.prisma`

Define o model `BudgetIndicator`, os tipos, a precisão decimal e os mapeamentos com `@map` e `@@map`.

### 9.6. `prisma/seed.ts`

Restaura a tabela e insere os cinco registros consolidados utilizados como amostra inicial.

### 9.7. `prisma.config.ts`

Centraliza configurações utilizadas pela CLI do Prisma 7:

- caminho do schema;
- diretório de migrations;
- comando de seed;
- leitura da `DATABASE_URL`.

### 9.8. `docker-compose.yml`

Define o PostgreSQL `15-alpine`, o banco `pnp_panorama_crud`, a porta `5433` no computador e o volume persistente `postgres_crud_data`.

### 9.9. `insomnia/`

Contém a coleção exportada em Insomnia YAML v5, com cenários de sucesso e erro para todos os endpoints.

---

## 10. Endpoints da API

A API utiliza por padrão:

```text
http://localhost:3002
```

| Método | Endpoint | Resultado principal |
|---|---|---|
| `GET` | `/` | Verifica o status da API |
| `GET` | `/api/budget-indicators` | Lista os indicadores |
| `GET` | `/api/budget-indicators/:id` | Consulta um indicador |
| `POST` | `/api/budget-indicators` | Cria um indicador |
| `PUT` | `/api/budget-indicators/:id` | Atualiza parcialmente um indicador |
| `DELETE` | `/api/budget-indicators/:id` | Exclui um indicador |

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

---

## 11. Como Executar o Projeto do Zero

### 11.1. Pré-requisitos

É necessário possuir:

- Node.js;
- npm;
- Docker;
- Docker Compose.

O Prisma, TSX, TypeScript e demais dependências são instalados pelo `npm install`.

### 11.2. Clonar o repositório

```bash
git clone https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud.git
```

### 11.3. Entrar no diretório

```bash
cd tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario_crud
```

### 11.4. Instalar as dependências

```bash
npm install
```

### 11.5. Criar o arquivo de ambiente

```bash
cp .env.example .env
```

Configuração local prevista:

```env
DATABASE_URL="postgresql://pnp_user:pnp_password@localhost:5433/pnp_panorama_crud?schema=public"
PORT=3002
ALLOWED_ORIGIN="http://localhost:5173"
```

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

Como a migration inicial já é versionada, pode ser utilizado:

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

O model `BudgetIndicator` deve apresentar cinco registros com IDs de `1` a `5`.

### 11.11. Executar a API em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3002
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

Foi criada uma coleção no Insomnia com a variável de ambiente:

```json
{
  "base_url": "http://localhost:3002"
}
```

A coleção contém:

| Cenário | Resultado esperado |
|---|---|
| Status da API | `200 OK` |
| Listagem | `200 OK` |
| Busca por ID válido | `200 OK` |
| Busca por ID inválido | `400 Bad Request` |
| Busca por ID inexistente | `404 Not Found` |
| Criação válida | `201 Created` |
| Criação inválida | `400 Bad Request` |
| Atualização parcial válida | `200 OK` |
| Atualização com valor negativo | `400 Bad Request` |
| Atualização com payload vazio | `400 Bad Request` |
| Atualização de ID inexistente | `404 Not Found` |
| Exclusão válida | `204 No Content` |
| Exclusão de ID inexistente | `404 Not Found` |
| Exclusão com ID inválido | `400 Bad Request` |
| Banco indisponível | `500 Internal Server Error` |

A coleção exportada está disponível em:

```text
insomnia/api-panorama-orcamentario-pnp.yaml
```

Para reproduzir o fluxo de alteração e exclusão:

1. executar `npm run seed`;
2. executar a criação válida, que deverá gerar o ID `6`;
3. atualizar parcialmente o registro `6`;
4. excluir o registro `6`;
5. repetir a exclusão para observar o retorno `404`.

---

## 15. Validações Realizadas

### Docker/PostgreSQL

```bash
docker compose config --quiet
docker compose ps
```

Foram verificadas as tabelas:

```text
_prisma_migrations
budget_indicators
```

### Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run prisma:studio
```

### API

Foram validados todos os endpoints `GET`, `POST`, `PUT` e `DELETE`, incluindo IDs inválidos, registros inexistentes, payloads inválidos e banco indisponível.

### CORS

Foi validada a origem permitida:

```text
http://localhost:5173
```

Uma origem diferente não recebe autorização correspondente no cabeçalho `Access-Control-Allow-Origin`. Clientes como `curl` ainda podem receber a resposta, pois CORS é uma política aplicada pelos navegadores e não um mecanismo de autenticação do servidor.

### Build

```bash
npm run build
npm start
```

---

## 16. Decisões de Desenvolvimento

### 16.1. Evolução em projeto independente

O projeto foi criado a partir da atividade anterior [tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario](https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario "API Catalogo PNP Panorama Orçamentário"), mas recebeu um novo repositório Git, novo container, novo banco, novo volume e portas próprias. Essa separação preserva a entrega anterior e permite executar as duas aplicações sem compartilhar estado.

### 16.2. Portas 3002 e 5433

A API utiliza a porta `3002`, enquanto o PostgreSQL é publicado em `5433` no computador e continua usando `5432` dentro do container.

As portas evitam conflito com a aplicação anterior, que utiliza `3001` e `5432`.

### 16.3. Entidade equivalente ao produto

O enunciado permite utilizar uma entidade equivalente ao catálogo de produtos. Foi mantido `BudgetIndicator` para continuar o vínculo com o domínio educacional e com o projeto de TCC.

### 16.4. Política de CORS

A origem permitida é definida por:

```env
ALLOWED_ORIGIN="http://localhost:5173"
```

Também foram declarados os métodos `GET`, `POST`, `PUT` e `DELETE` e o header `Content-Type`.

O CORS controla o acesso realizado por navegadores. Ele não substitui autenticação, autorização ou regras de firewall.

### 16.5. Validação com Zod

O TypeScript valida tipos durante o desenvolvimento, mas não garante que o JSON recebido em execução possua os tipos esperados.

O Zod foi utilizado para validar o conteúdo real de `request.body`, produzir mensagens claras e impedir que dados inválidos sejam enviados ao Prisma.

### 16.6. Atualização parcial com PUT

O endpoint `PUT` utiliza um schema criado com `.partial()`, conforme solicitado no enunciado. Assim, todos os campos tornam-se opcionais durante a atualização, mas uma validação adicional exige que pelo menos um campo seja informado.

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

---

## 17. Relação com a Aula

O projeto aplica o fluxo conceitual trabalhado na Aula 3:

```text
front-end / Insomnia
        -> CORS
        -> Express
        -> Zod
        -> Prisma Client
        -> PostgreSQL
```

Os principais conceitos aplicados foram:

- configuração do middleware CORS;
- conexão por uma instância reutilizável do Prisma Client;
- operações `findMany`, `findUnique`, `create`, `update` e `delete`;
- validação dos IDs;
- validação dos payloads em tempo de execução;
- schema parcial para atualização;
- tratamento de `ZodError`;
- tratamento de `P2025`;
- uso adequado dos status HTTP;
- testes de sucesso e erro no Insomnia.

A integração com um front-end não faz parte desta entrega. A política de CORS e os endpoints, entretanto, deixam a API preparada para ser consumida por uma aplicação Vite executada em `http://localhost:5173`.

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

É recriado por `npm install`.

### `dist/`

É recriado por `npm run build`.

### `.env`

Contém a configuração local e deve ser recriado a partir de `.env.example`.

### `src/generated/`

Contém o Prisma Client gerado por `npm run prisma:generate`.

### Auditoria de dependências

Foi executado `npm audit` durante a revisão. Foram identificados alertas em dependências transitivas, inclusive componentes internos do Prisma CLI. Como esta aplicação possui finalidade acadêmica, execução local e versões já validadas para a atividade, a substituição forçada ou o downgrade do Prisma ficaram fora do escopo.

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
- autenticação e autorização;
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

- Repositório da Aula 3 - Tecnologias Back-End:  
  https://github.com/lucaslattari/tec_back_end_aula3

- Vídeo da Aula 3 - CRUD completo, integração e validação de dados:  
  https://www.youtube.com/watch?v=23JvZTtMMPE

- Projeto desenvolvido na atividade anterior:  
  https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario

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
