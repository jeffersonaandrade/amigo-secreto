# 🚀 Guia de Deploy no Netlify

Este guia explica como fazer o deploy do projeto **Amigo Secreto** no Netlify.

## 📋 Pré-requisitos

1. Conta no [Netlify](https://www.netlify.com/)
2. Projeto no [Firebase Console](https://console.firebase.google.com/)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

---

## 🔧 Passo 1: Configurar Variáveis de Ambiente no Netlify

### 1.1. Acesse o Netlify Dashboard

1. Faça login no [Netlify](https://app.netlify.com/)
2. Vá em **Site settings** → **Environment variables**

### 1.2. Adicione as Variáveis do Firebase

Adicione todas as variáveis do arquivo `.env.example`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_TITLE=Amigo Secreto
```

**⚠️ IMPORTANTE:**
- Todas as variáveis do Firebase **devem** ter o prefixo `NEXT_PUBLIC_`
- Essas variáveis são públicas e podem ser expostas no navegador (é seguro para Firebase)

---

## 🔧 Passo 2: Configurar Domínios Autorizados no Firebase

### 2.1. Adicione o Domínio do Netlify

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication** → **Settings** → **Authorized domains**
3. Adicione o domínio do Netlify:
   - `seu-site.netlify.app` (domínio padrão do Netlify)
   - `seu-dominio.com` (se você configurar um domínio customizado)

---

## 🚀 Passo 3: Fazer o Deploy

### Opção A: Deploy via Git (Recomendado)

1. **Conecte o Repositório:**
   - No Netlify Dashboard, clique em **Add new site** → **Import an existing project**
   - Conecte seu repositório Git (GitHub/GitLab/Bitbucket)
   - Selecione o repositório do projeto

2. **Configure o Build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - O Netlify detecta automaticamente o Next.js e usa o plugin correto

3. **Adicione as Variáveis de Ambiente:**
   - Vá em **Site settings** → **Environment variables**
   - Adicione todas as variáveis do Passo 1.2

4. **Faça o Deploy:**
   - Clique em **Deploy site**
   - Aguarde o build completar (pode levar 2-5 minutos)

### Opção B: Deploy Manual (via Netlify CLI)

1. **Instale o Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Faça login:**
   ```bash
   netlify login
   ```

3. **Inicialize o site:**
   ```bash
   netlify init
   ```

4. **Faça o deploy:**
   ```bash
   netlify deploy --prod
   ```

---

## ✅ Passo 4: Verificar o Deploy

### 4.1. Teste as Funcionalidades

Após o deploy, teste:

- [ ] Página inicial carrega corretamente
- [ ] Login com Google funciona
- [ ] Criação de grupos funciona
- [ ] Adição de participantes funciona
- [ ] Sorteio funciona
- [ ] Links de compartilhamento funcionam

### 4.2. Verifique os Logs

Se algo não funcionar:

1. Vá em **Site settings** → **Build & deploy** → **Deploy log**
2. Verifique se há erros no build
3. Verifique se todas as variáveis de ambiente estão configuradas

---

## 🔍 Troubleshooting

### Erro: "Firebase Auth não está inicializado"

**Causa:** Variáveis de ambiente não configuradas ou com nomes errados.

**Solução:**
1. Verifique se todas as variáveis têm o prefixo `NEXT_PUBLIC_`
2. Verifique se os valores estão corretos no Netlify Dashboard
3. Faça um novo deploy após adicionar/corrigir as variáveis

### Erro: "Cross-Origin-Opener-Policy"

**Causa:** Headers não configurados corretamente.

**Solução:** O arquivo `netlify.toml` já está configurado com o header necessário. Se o erro persistir, verifique se o arquivo está no repositório.

### Erro: "Unable to find tRPC Context"

**Causa:** Build falhou ou hooks não estão protegidos.

**Solução:** 
1. Verifique os logs do build no Netlify
2. Certifique-se de que o build local funciona (`npm run build`)
3. Se necessário, limpe o cache do Netlify e faça um novo deploy

### Build muito lento

**Solução:**
- O Netlify tem um timeout de 15 minutos para builds
- Se o build estiver demorando muito, verifique se há dependências desnecessárias
- Considere usar o cache do Netlify (já configurado automaticamente)

---

## 📝 Notas Importantes

1. **Variáveis de Ambiente:**
   - As variáveis são carregadas durante o build
   - Se você adicionar novas variáveis, precisa fazer um novo deploy
   - Variáveis com `NEXT_PUBLIC_` são expostas ao navegador (públicas)

2. **Domínios Autorizados:**
   - Sempre adicione o domínio do Netlify no Firebase Console
   - Se você mudar o domínio, atualize no Firebase também

3. **Cache:**
   - O Netlify faz cache automático do build
   - Se você fizer mudanças e não aparecerem, limpe o cache ou force um novo deploy

4. **SSL/HTTPS:**
   - O Netlify fornece SSL automático para todos os sites
   - Não é necessário configurar nada adicional

---

## 🎉 Pronto!

Seu site está no ar! 🚀

Para atualizações futuras, basta fazer `git push` e o Netlify fará o deploy automaticamente (se você configurou o deploy via Git).

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do build no Netlify Dashboard
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Teste o build localmente primeiro (`npm run build`)

