# 🔐 Como Configurar Login com Google

Este guia vai te ajudar a habilitar o login com Google no Firebase Authentication.

**⚠️ IMPORTANTE:** Este projeto usa APENAS login com Google. O login com email/senha foi removido.

## 📋 Passo a Passo

### 1. Habilitar Google Authentication no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **"Authentication"**
4. Vá na aba **"Sign-in method"** ou **"Métodos de login"**
5. Clique em **"Google"**
6. Ative o toggle **"Enable"**
7. Selecione um **email de suporte** (pode ser o seu email pessoal)
8. Clique em **"Save"** ou **"Salvar"**

### 2. Configurar OAuth Consent Screen (se necessário)

Se você ainda não configurou o OAuth Consent Screen:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto do Firebase
3. Vá em **"APIs & Services"** > **"OAuth consent screen"**
4. Escolha **"External"** (para desenvolvimento) ou **"Internal"** (se for organização)
5. Preencha:
   - **App name**: Nome do seu app (ex: "Amigo Secreto")
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
6. Clique em **"Save and Continue"**
7. Na tela de **"Scopes"**, clique em **"Save and Continue"**
8. Na tela de **"Test users"**, adicione emails de teste (opcional para desenvolvimento)
9. Clique em **"Save and Continue"**
10. Revise e clique em **"Back to Dashboard"**

### 3. Configurar Domínios Autorizados

1. No Firebase Console, vá em **Authentication** > **Settings** > **Authorized domains**
2. Certifique-se de que os seguintes domínios estão listados:
   - `localhost` (para desenvolvimento)
   - Seu domínio de produção (ex: `seusite.com`)

### 4. Testar o Login

1. Acesse a página de login do seu app
2. Clique no botão **"Continuar com Google"**
3. Uma janela popup do Google deve abrir
4. Selecione a conta Google que deseja usar
5. Autorize o acesso
6. Você deve ser redirecionado para o dashboard

## ✅ Pronto!

Agora o login com Google está configurado e funcionando. Os usuários podem:

- Fazer login com email/senha (como antes)
- Fazer login com Google (novo!)
- Criar conta com email/senha
- Criar conta automaticamente ao fazer login com Google pela primeira vez

## 🔒 Segurança

- O Firebase gerencia toda a autenticação de forma segura
- Os tokens são armazenados localmente no navegador
- Não é necessário armazenar senhas do Google
- O usuário pode revogar o acesso a qualquer momento nas configurações da conta Google

## 🐛 Problemas Comuns

### Erro: "popup_closed_by_user"
- O usuário fechou a janela de login antes de completar
- Solução: Tente novamente

### Erro: "auth/unauthorized-domain"
- O domínio não está autorizado no Firebase
- Solução: Adicione o domínio em **Authentication** > **Settings** > **Authorized domains**

### Erro: "auth/operation-not-allowed"
- O método de login Google não está habilitado
- Solução: Habilite em **Authentication** > **Sign-in method** > **Google**

