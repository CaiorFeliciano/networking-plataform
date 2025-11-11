# Networking Platform

## Backend (NestJS, Prisma ORM e SQLite)

Pré-requisitos:
- Node.js 18+
- npm ou yarn

## Como Executar
### 1. Instalação das Dependências
 - cd backend
 - npm install
### 2. Configuração do ambiente
Arquivo .env com as especificações:<br>
PORT=3001<br>
NODE_ENV=development<br>
DATABASE_URL="file:./dev.db"<br>
ADMIN_API_KEY="networking-admin-2025"
### 3.Configuração do Banco de Dados
No terminal execute:<br>
npx prisma generate (gera o cliente prisma)<br>
npx prisma db push (cria o banco e tabelas)<br>
npx prisma studio (visualiza as tabelas)
### 4. Executar a Aplicação
#### Desenvolvimento:
npm run start:dev
#### Produção:
npm run build<br>
npm run start:prod

A aplicação estará rodando em: http://localhost:3001

  

