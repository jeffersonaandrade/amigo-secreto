"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import superjson from "superjson";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { AppRouter } from "@/server/routers";
import { auth } from "@/lib/firebase";

export const trpc = createTRPCReact<AppRouter>();

async function getAuthToken(): Promise<string | null> {
  if (!auth) {
    console.log("[Auth Token] Firebase Auth não está inicializado");
    return null;
  }
  const user = auth.currentUser;
  if (!user) {
    console.log("[Auth Token] Nenhum usuário logado no momento");
    return null;
  }
  try {
    const token = await user.getIdToken();
    console.log("[Auth Token] Token obtido com sucesso ✅", token.substring(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("[Auth Token] Erro ao obter token:", error);
    return null;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            const token = await getAuthToken();
            return token ? { authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

