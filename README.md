# Amigo Secreto - Sistema de Sorteio

Sistema web para organização de grupos de "Amigo Secreto" (Secret Santa) com interface temática natalina.

## 📋 O que o código faz

Este é um sistema completo de **Amigo Secreto** que permite:

### Funcionalidades Principais

1. **Autenticação**: Login e registro via Firebase Auth (email/senha)
2. **Gestão de Grupos**: 
   - Criar grupos de amigo secreto
   - Definir nome, descrição, valor sugerido e data do evento
   - Gerar código de convite único
3. **Participantes**:
   - Organizador adiciona participantes manualmente (sem necessidade de cadastro)
   - Informações opcionais: email, telefone, lista de desejos
   - Cada participante recebe um token único para acessar seu resultado
4. **Sorteio**:
   - Algoritmo que garante que ninguém tire a si mesmo
   - Possibilidade de refazer o sorteio
   - Visualização de todos os pares (apenas organizador)
5. **Interface**:
   - Tema visual natalino
   - Roleta animada na página de resultado do participante
   - Design responsivo (mobile e desktop)

## 🛠️ Stack Tecnológica

- **Backend**: Node.js + Express + tRPC
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Banco de Dados**: Firebase Firestore (NoSQL)
- **Autenticação**: Firebase Auth
- **Deploy**: Netlify (Serverless Functions)
- **Testes**: Vitest

## 🚀 Requisitos para Testes Locais

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes)
- Conta no Firebase (gratuita)

### 2. Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** com Email/Password
4. Crie um banco de dados **Firestore** (modo produção ou teste)
5. Vá em **Configurações do Projeto** > **Contas de Serviço**
6. Gere uma nova chave privada (JSON) para o Firebase Admin SDK

### 3. Instalação

```bash
# Instalar dependências
npm install
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration (Client)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
FIREBASE_PROJECT_ID=your-project-id

# Application
NODE_ENV=development
PORT=3000
VITE_APP_TITLE=Amigo Secreto
VITE_APP_LOGO=https://placehold.co/128x128/E1E7EF/1F2937?text=App

# Security
JWT_SECRET=sua-chave-secreta-jwt-muito-segura

# Owner email (will be set as admin)
OWNER_EMAIL=admin@example.com

# Optional: Analytics
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**Importante**: 
- Todas as variáveis começam com `NEXT_PUBLIC_` porque são usadas no cliente (navegador)
- Você pode encontrar essas informações no Firebase Console > Configurações do Projeto > Seus apps
- **Não precisa de Admin SDK!** Tudo funciona com Client SDK + Firestore Security Rules

### 5. Executar o Projeto

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# O servidor estará disponível em http://localhost:3000
```

### 6. Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test --watch
```

## 📁 Estrutura do Projeto

```
amigo-secreto/
├── app/                 # Next.js App Router
│   ├── api/             # API Routes (tRPC)
│   └── ...              # Páginas Next.js
├── src/                 # Código fonte
│   ├── pages/           # Componentes de páginas
│   ├── components/      # Componentes React
│   ├── lib/             # Firebase client config
│   └── _core/           # Hooks e utilitários
├── server/              # Lógica do servidor (usado pelas API Routes)
│   ├── _core/           # Código core (auth, db, etc)
│   │   ├── firebase-admin.ts  # Firebase Admin config
│   │   └── context-next.ts   # tRPC context para Next.js
│   ├── routers.ts       # Rotas tRPC
│   └── db.ts            # Funções Firestore
├── shared/              # Código compartilhado
│   └── types.ts         # Tipos TypeScript
└── package.json
```

## 🌐 Deploy no Netlify

### 1. Preparação

1. Faça push do código para um repositório Git (GitHub, GitLab, etc)
2. Acesse [Netlify](https://www.netlify.com/) e faça login

### 2. Configuração

1. Clique em **"Add new site"** > **"Import an existing project"**
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente no Netlify:
   - Vá em **Site settings** > **Environment variables**
   - Adicione todas as variáveis do `.env` (exceto as que começam com `VITE_` que devem ser adicionadas também)
   - **Importante**: Para `FIREBASE_SERVICE_ACCOUNT`, cole o JSON completo como string

### 3. Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next` (Next.js gerencia automaticamente)

### 4. Deploy

O Netlify fará o deploy automaticamente após cada push. Você também pode fazer deploy manual clicando em **"Deploy site"**.

## 🧪 Testes Locais - Checklist

- [ ] Node.js e npm instalados
- [ ] Projeto Firebase criado
- [ ] Firebase Auth ativado (Email/Password)
- [ ] Firestore criado
- [ ] Chave privada do Firebase Admin baixada
- [ ] Arquivo `.env` configurado com todas as variáveis
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor Next.js iniciado (`npm run dev`)
- [ ] Acessar http://localhost:3000
- [ ] Criar conta de teste no Firebase Auth

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor em modo produção
- `npm test` - Executa testes
- `npm run check` - Verifica tipos TypeScript
- `npm run format` - Formata código com Prettier

## 🔐 Segurança

- Tokens de acesso únicos para cada participante
- Validação de permissões (apenas criador pode editar/deletar grupo)
- Sorteio criptograficamente seguro
- Autenticação via Firebase Auth com tokens JWT
- Firestore Security Rules (configure no Firebase Console)

## 🔥 Firebase Security Rules

Configure as regras de segurança no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.token.email == resource.data.email;
      allow write: if request.auth != null && request.auth.token.email == resource.data.email;
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.creatorId == request.auth.uid;
    }
    
    // Participants collection
    match /participants/{participantId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Draws collection
    match /draws/{drawId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

**Nota**: Essas são regras básicas. Ajuste conforme suas necessidades de segurança.

## 📚 Documentação Adicional

- [TODO.md](./todo.md) - Lista de tarefas e melhorias planejadas

## 🆘 Troubleshooting

### Erro: "Firebase not initialized"
- Verifique se todas as variáveis `NEXT_PUBLIC_FIREBASE_*` estão configuradas
- Certifique-se de que o Firebase Auth está ativado no console

### Erro: "Firebase Auth not initialized"
- Verifique se todas as variáveis `NEXT_PUBLIC_FIREBASE_*` estão configuradas
- Verifique se o Firebase Auth está ativado no console

### Erro no Netlify: "Build failed"
- Verifique se o plugin `@netlify/plugin-nextjs` está instalado
- Verifique se todas as variáveis de ambiente estão configuradas no Netlify
- Certifique-se de que o `netlify.toml` está configurado corretamente
