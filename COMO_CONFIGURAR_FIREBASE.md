# 🔥 Como Configurar o Firebase

Este guia vai te ajudar a configurar todas as variáveis do Firebase necessárias para o projeto.

## 📋 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Preencha o nome do projeto (ex: "amigo-secreto")
4. Aceite os termos e continue
5. **Desative** o Google Analytics (opcional, pode ativar depois)
6. Clique em **"Criar projeto"**

### 2. Configurar Firebase Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Get started"** ou **"Começar"**
3. Vá na aba **"Sign-in method"** ou **"Métodos de login"**
4. Clique em **"Email/Password"**
5. Ative o primeiro toggle (Email/Password)
6. Clique em **"Salvar"**

### 3. Criar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"** ou **"Criar banco de dados"**
3. Escolha **"Start in production mode"** (você pode mudar depois)
4. Escolha a localização (ex: `southamerica-east1` para Brasil)
5. Clique em **"Enable"** ou **"Ativar"**

### 4. Obter Credenciais do Cliente (Frontend)

1. No menu lateral, clique no ícone de **⚙️ Configurações** > **"Project settings"**
2. Role até a seção **"Your apps"** ou **"Seus apps"**
3. Clique no ícone **`</>`** (Web) para adicionar um app web
4. Preencha um nome para o app (ex: "Amigo Secreto Web")
5. **NÃO** marque "Also set up Firebase Hosting"
6. Clique em **"Register app"**
7. Você verá um código JavaScript com as credenciais. Copie os valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Preencha no `.env`:**
- `VITE_FIREBASE_API_KEY` = `apiKey`
- `VITE_FIREBASE_AUTH_DOMAIN` = `authDomain`
- `VITE_FIREBASE_PROJECT_ID` = `projectId`
- `VITE_FIREBASE_STORAGE_BUCKET` = `storageBucket`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `messagingSenderId`
- `VITE_FIREBASE_APP_ID` = `appId`

### 5. Obter Service Account (Backend)

1. No menu lateral, clique no ícone de **⚙️ Configurações** > **"Project settings"**
2. Vá na aba **"Service accounts"** ou **"Contas de serviço"**
3. Clique em **"Generate new private key"** ou **"Gerar nova chave privada"**
4. Uma confirmação aparecerá. Clique em **"Generate key"**
5. Um arquivo JSON será baixado (ex: `seu-projeto-firebase-adminsdk-xxxxx.json`)

**Agora você precisa converter esse JSON para string:**

#### Opção 1: Usando Node.js (Recomendado)

Crie um arquivo temporário `convert-service-account.js`:

```javascript
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('./seu-projeto-firebase-adminsdk-xxxxx.json', 'utf8'));
console.log(JSON.stringify(serviceAccount));
```

Execute:
```bash
node convert-service-account.js
```

Copie a saída e cole no `.env` na variável `FIREBASE_SERVICE_ACCOUNT`

#### Opção 2: Manualmente

1. Abra o arquivo JSON baixado
2. Copie TODO o conteúdo
3. Cole no `.env` na variável `FIREBASE_SERVICE_ACCOUNT`
4. **IMPORTANTE**: Se houver quebras de linha na `private_key`, substitua por `\n`
   - Exemplo: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"`

**Preencha no `.env`:**
- `FIREBASE_SERVICE_ACCOUNT` = JSON completo como string
- `FIREBASE_PROJECT_ID` = mesmo valor de `VITE_FIREBASE_PROJECT_ID`

### 6. Configurar Firestore Security Rules

1. No menu lateral, clique em **"Firestore Database"**
2. Vá na aba **"Rules"** ou **"Regras"**
3. Cole as regras abaixo:

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

4. Clique em **"Publish"** ou **"Publicar"**

### 7. Configurar Variáveis Restantes

No arquivo `.env`, preencha:

- `JWT_SECRET`: Gere uma chave aleatória:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- `OWNER_EMAIL`: Seu email que será admin (ex: `seu-email@gmail.com`)

- `VITE_APP_TITLE`: Título da aplicação (já está como "Amigo Secreto")

- `VITE_APP_LOGO`: URL do logo (pode deixar o placeholder por enquanto)

## ✅ Verificação

Após preencher tudo, teste se está funcionando:

```bash
npm run dev
```

Se tudo estiver correto, o servidor iniciará sem erros e você poderá acessar `http://localhost:3000`

## 🆘 Problemas Comuns

### Erro: "FIREBASE_SERVICE_ACCOUNT is required"
- Verifique se a variável está preenchida no `.env`
- Certifique-se de que o JSON está como string (entre aspas)
- Verifique se as quebras de linha na `private_key` estão como `\n`

### Erro: "Firebase Auth not initialized"
- Verifique se todas as variáveis `VITE_FIREBASE_*` estão preenchidas
- Certifique-se de que o Firebase Auth está ativado no console

### Erro: "Permission denied" no Firestore
- Verifique se as Security Rules foram publicadas
- Certifique-se de estar autenticado no Firebase Auth

