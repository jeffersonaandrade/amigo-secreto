import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { randomBytes } from "crypto";

// Função auxiliar para gerar código de convite único
export function generateInviteCode(): string {
  return randomBytes(16).toString("hex");
}

// Função auxiliar para gerar token de acesso único
export function generateAccessToken(): string {
  return randomBytes(32).toString("hex");
}

// Algoritmo de sorteio que garante que ninguém tira a si mesmo
export function performDraw(participantIds: string[]): Map<string, string> {
  if (participantIds.length < 2) {
    throw new Error("É necessário pelo menos 2 participantes para realizar o sorteio");
  }

  const shuffled = [...participantIds];
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // Embaralhar array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    // Verificar se ninguém tirou a si mesmo
    const valid = shuffled.every((receiverId, index) => receiverId !== participantIds[index]);
    
    if (valid) {
      const result = new Map<string, string>();
      participantIds.forEach((giverId, index) => {
        result.set(giverId, shuffled[index]!);
      });
      return result;
    }

    attempts++;
  }

  throw new Error("Não foi possível realizar o sorteio após várias tentativas");
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      // No Next.js, logout é feito no cliente (Firebase Auth)
      return {
        success: true,
      } as const;
    }),
  }),

  // Helper: Gerar código de convite
  helpers: router({
    generateInviteCode: protectedProcedure.mutation(() => {
      return { inviteCode: generateInviteCode() };
    }),
    generateAccessToken: protectedProcedure.mutation(() => {
      return { accessToken: generateAccessToken() };
    }),
    // Processar algoritmo de sorteio
    processDraw: protectedProcedure
      .input(z.object({
        participantIds: z.array(z.string()),
      }))
      .mutation(({ input }) => {
        const drawResult = performDraw(input.participantIds);
        // Converter Map para objeto simples para serialização
        const result: Record<string, string> = {};
        drawResult.forEach((receiverId, giverId) => {
          result[giverId] = receiverId;
        });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
