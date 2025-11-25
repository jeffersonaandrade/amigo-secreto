# Como Usar Apenas Client SDK (Sem Admin SDK)

Este projeto usa **apenas o Firebase Client SDK**, sem Admin SDK. Isso simplifica muito a configuração e mantém tudo no plano gratuito.

## ✅ O que você precisa no `.env.local`:

```env
# Firebase Configuration (Client-side - use NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# App Title (opcional)
NEXT_PUBLIC_APP_TITLE=Amigo Secreto
```

## ❌ O que você NÃO precisa:

- ~~`FIREBASE_SERVICE_ACCOUNT`~~ - Não é necessário!
- ~~`FIREBASE_PROJECT_ID`~~ (sem prefixo) - Não é necessário!
- ~~`JWT_SECRET`~~ - Não é necessário!
- ~~`OWNER_EMAIL`~~ - Não é necessário!

## 🔒 Segurança

A segurança é garantida pelas **Firestore Security Rules** (arquivo `firestore.rules`).

Configure essas regras no Firebase Console:
1. Vá em Firestore Database > Rules
2. Cole o conteúdo do arquivo `firestore.rules`
3. Publique as regras

As regras garantem que:
- Usuários só podem criar/editar/deletar seus próprios grupos
- Apenas o criador do grupo pode adicionar participantes
- Apenas o criador pode realizar o sorteio
- Participantes só podem ver seu próprio resultado usando o token

## 🚀 Como Funciona

1. **Login**: Usuário faz login no cliente usando Firebase Auth (Client SDK)
2. **Operações**: Todas as operações de banco são feitas direto do cliente usando Firestore Client SDK
3. **Validação**: As Firestore Rules validam todas as operações
4. **tRPC**: Usado apenas para processar lógica (como o algoritmo de sorteio), não para acessar o banco diretamente

## 📝 Próximos Passos

O código atual ainda usa `db.ts` no servidor. Para completar a migração para Client SDK puro, precisamos:

1. Fazer as operações de banco serem feitas direto do cliente
2. O tRPC vai apenas processar a lógica e retornar dados
3. O cliente salva os dados no Firestore usando Client SDK

Isso será feito na próxima etapa.

