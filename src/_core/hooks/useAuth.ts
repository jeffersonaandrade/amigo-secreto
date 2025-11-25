import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, signInWithRedirect, signInWithPopup, getRedirectResult, GoogleAuthProvider, type User as FirebaseUser } from "firebase/auth";
import * as firestore from "@/lib/firestore";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};
  
  // Proteção: só inicializa hooks do tRPC no cliente
  const isClient = typeof window !== 'undefined';
  const utils = isClient ? trpc.useUtils() : null;

  // Get user from Firestore based on Firebase Auth
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Começa como true para evitar "piscar" da tela
  
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    
    // 1. Verificar ativamente se voltamos do Google com erro ou sucesso
    // IMPORTANTE: Aguardar um pouco para garantir que o Firebase processou o redirect
    const checkRedirect = async () => {
      if (!auth) return;
      
      try {
        // Pequeno delay para garantir que o Firebase processou o redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ [Redirect] Sucesso! Usuário retornou do Google:", result.user.email);
          console.log("✅ [Redirect] UID:", result.user.uid);
          console.log("✅ [Redirect] Provider:", result.providerId);
          // O onAuthStateChanged vai disparar automaticamente após isso
        } else {
          console.log("ℹ️ [Redirect] Nenhum resultado de redirect encontrado (login normal ou reload).");
        }
      } catch (error: any) {
        console.error("❌ [Redirect] ERRO CRÍTICO ao processar retorno do Google:", error);
        console.error("❌ [Redirect] Código do erro:", error.code);
        console.error("❌ [Redirect] Mensagem:", error.message);
        if (error.stack) {
          console.error("❌ [Redirect] Stack:", error.stack);
        }
      }
    };
    
    checkRedirect();

    // 2. Ouve mudanças de sessão (Login normal e também quando volta do Google)
    // O onAuthStateChanged dispara automaticamente quando o usuário volta do Google
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(`[Auth] onAuthStateChanged disparado: ${user ? `Usuário Logado: ${user.email} (${user.uid})` : 'Usuário deslogado'}`);
      setFirebaseUser(user);
      if (user) {
        // Create or update user in Firestore
        try {
          console.log("[Auth] Sincronizando usuário no Firestore...");
          await firestore.upsertUser({
            id: user.uid,
            email: user.email || "",
            name: user.displayName || null,
            lastSignedIn: new Date(),
          });
          console.log("[Auth] Usuário sincronizado no Firestore com sucesso ✅");
        } catch (error) {
          console.error("[Auth] Erro ao sincronizar usuário no Firestore:", error);
        }
      } else {
        setFirebaseUser(null);
      }
      
      // Só paramos de carregar quando o Firebase nos deu a primeira resposta
      // Isso evita o "piscar" da tela de login quando o usuário volta do Google
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Get user data from Firestore
  // IMPORTANTE: Só executa no cliente para evitar erros durante o build
  const userQuery = isClient ? trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!firebaseUser,
  }) : { data: null, isLoading: false, error: null, refetch: async () => ({}) };

  // Logs para debug (usando useEffect ao invés de onSuccess/onError)
  useEffect(() => {
    if (userQuery.data !== undefined) {
      console.log("[Auth] Query auth.me retornou:", userQuery.data ? `Usuário: ${userQuery.data.email} (${userQuery.data.id})` : "null");
    }
    if (userQuery.error) {
      console.error("[Auth] Erro na query auth.me:", userQuery.error);
    }
  }, [userQuery.data, userQuery.error]);

  const logoutMutation = isClient ? trpc.auth.logout.useMutation({
    onSuccess: () => {
      if (utils) utils.auth.me.setData(undefined, null);
    },
  }) : { mutateAsync: async () => {}, isPending: false, error: null };

  const logout = useCallback(async () => {
    if (!auth || !isClient) return;
    try {
      await signOut(auth);
      if (logoutMutation.mutateAsync) {
        await logoutMutation.mutateAsync();
      }
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      if (utils) {
        utils.auth.me.setData(undefined, null);
        await utils.auth.me.invalidate();
      }
    }
  }, [logoutMutation, utils, isClient]);

  const state = useMemo(() => {
    return {
      user: userQuery.data ?? null,
      loading: authLoading || userQuery.isLoading || logoutMutation.isPending,
      error: userQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(userQuery.data),
    };
  }, [
    authLoading,
    userQuery.data,
    userQuery.error,
    userQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (userQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    userQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => userQuery.refetch(),
    logout,
  };
}

export async function loginWithGoogle() {
  if (!auth) {
    console.error("[Auth Error] Firebase Auth não está inicializado");
    console.error("[Auth Error] Verifique o console para ver quais chaves do Firebase estão faltando");
    throw new Error("Firebase Auth não está inicializado. Verifique as variáveis de ambiente no arquivo .env.local e reinicie o servidor.");
  }
  
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  // 1. Detecta se é dispositivo móvel (Celular/Tablet)
  // Essa Regex cobre 99% dos dispositivos móveis
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  try {
    if (isMobile) {
      // 📱 CELULAR: Usa Redirect
      // Motivo: Popups são bloqueados ou têm UX ruim em telas pequenas.
      console.log("📱 [Auth] Mobile detectado: Iniciando Redirect...");
      await signInWithRedirect(auth, provider);
      // O código para aqui, pois a página vai mudar
    } else {
      // 💻 PC/NOTEBOOK: Usa Popup
      // Motivo: Funciona perfeitamente em Localhost e não sofre com perda de cookies.
      console.log("💻 [Auth] Desktop detectado: Iniciando Popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ [Auth] Popup fechado com sucesso! Usuário:", result.user.email);
      // O Popup fecha sozinho e o onAuthStateChanged detecta o login automaticamente
      return result;
    }
  } catch (error: any) {
    console.error("❌ [Auth] Erro no login híbrido:", error);
    
    // Se o popup falhar (ex: bloqueado), tenta redirect como fallback
    if (!isMobile && (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user')) {
      console.log("⚠️ [Auth] Popup bloqueado, tentando Redirect como fallback...");
      await signInWithRedirect(auth, provider);
      return;
    }
    
    throw error; // Repassa o erro para a tela de Login mostrar o toast
  }
}

// Função para verificar resultado do redirect (chamar na página após redirect)
export async function handleGoogleRedirect() {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Erro ao processar redirect do Google:", error);
    return null;
  }
}
