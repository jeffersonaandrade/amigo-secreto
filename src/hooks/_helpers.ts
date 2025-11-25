/**
 * Helper para verificar se estamos no cliente (navegador)
 * Útil para evitar erros durante o build do Next.js
 */
export const isClient = typeof window !== 'undefined';

/**
 * Helper para criar um QueryClient mock durante o build
 * Isso evita erros quando hooks são chamados durante o SSG
 * 
 * IMPORTANTE: Este helper deve ser usado apenas dentro de componentes client-side.
 * Durante o build, retorna um mock que não faz nada.
 */
export function safeUseQueryClient() {
  // Durante o build (server-side), retorna um mock
  if (!isClient) {
    return {
      invalidateQueries: () => Promise.resolve(),
      refetchQueries: () => Promise.resolve(),
      setQueryData: () => {},
      getQueryData: () => undefined,
    } as any;
  }
  
  // No cliente, importa e usa o hook real
  // Usa import dinâmico para evitar problemas durante o build
  try {
    const { useQueryClient } = require("@tanstack/react-query");
    return useQueryClient();
  } catch {
    // Fallback caso o require falhe
    return {
      invalidateQueries: () => Promise.resolve(),
      refetchQueries: () => Promise.resolve(),
      setQueryData: () => {},
      getQueryData: () => undefined,
    } as any;
  }
}

