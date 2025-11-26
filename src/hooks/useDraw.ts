"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as firestore from "@/lib/firestore";
import { toast } from "sonner";
import { isClient } from "./_helpers";

// Algoritmo de sorteio que garante que ninguém tira a si mesmo
function performDrawAlgorithm(participantIds: string[]): Map<string, string> {
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

export function useDraw(groupId: string | null) {
  // Durante o build, retorna valores mock
  if (!isClient) {
    return {
      draws: [],
      isLoading: false,
      performDraw: async () => ({} as any),
      redoDraw: async () => {},
      isPerforming: false,
      isRedoing: false,
    };
  }

  const queryClient = useQueryClient();

  const drawsQuery = useQuery({
    queryKey: ["draws", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      return firestore.getDrawsByGroup(groupId);
    },
    enabled: !!groupId,
  });

  const performDrawMutation = useMutation({
    mutationFn: async (participantIds: string[]) => {
      if (!groupId) throw new Error("ID do grupo não fornecido");
      
      // Processar algoritmo de sorteio no cliente
      const drawResult = performDrawAlgorithm(participantIds);
      
      // Salvar os resultados no Firestore
      const drawPromises = Array.from(drawResult.entries()).map(([giverId, receiverId]) =>
        firestore.createDraw({
          groupId,
          giverId,
          receiverId,
        })
      );
      
      await Promise.all(drawPromises);
      
      // Marcar grupo como sorteado
      await firestore.updateGroup(groupId, { isDrawn: true });
      
      return { success: true };
    },
    onSuccess: async () => {
      // Invalida e recarrega as queries relacionadas imediatamente
      await queryClient.invalidateQueries({ queryKey: ["draws", groupId] });
      await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      // Força um refetch para garantir que os dados sejam atualizados
      await queryClient.refetchQueries({ queryKey: ["draws", groupId] });
      await queryClient.refetchQueries({ queryKey: ["group", groupId] });
      toast.success("Sorteio realizado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar sorteio");
    },
  });

  const redoDrawMutation = useMutation({
    mutationFn: async () => {
      if (!groupId) throw new Error("ID do grupo não fornecido");
      
      // Deletar sorteios anteriores
      await firestore.deleteDrawsByGroup(groupId);
      
      // Marcar grupo como não sorteado
      await firestore.updateGroup(groupId, { isDrawn: false });
    },
    onSuccess: async () => {
      // Invalida e recarrega as queries relacionadas imediatamente
      await queryClient.invalidateQueries({ queryKey: ["draws", groupId] });
      await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      // Força um refetch para garantir que os dados sejam atualizados
      await queryClient.refetchQueries({ queryKey: ["draws", groupId] });
      await queryClient.refetchQueries({ queryKey: ["group", groupId] });
      toast.success("Sorteio resetado!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao resetar sorteio");
    },
  });

  return {
    draws: drawsQuery.data ?? [],
    isLoading: drawsQuery.isLoading,
    performDraw: performDrawMutation.mutateAsync,
    redoDraw: redoDrawMutation.mutateAsync,
    isPerforming: performDrawMutation.isPending,
    isRedoing: redoDrawMutation.isPending,
  };
}

export function useDrawForGiver(groupId: string | null, giverId: string | null) {
  // Durante o build, retorna valores mock
  if (!isClient) {
    return {
      data: null,
      isLoading: false,
      error: null,
      refetch: async () => ({ data: null, error: null }),
    } as any;
  }

  return useQuery({
    queryKey: ["draw", groupId, giverId],
    queryFn: async () => {
      if (!groupId || !giverId) return null;
      return firestore.getDrawForGiver(groupId, giverId);
    },
    enabled: !!groupId && !!giverId,
  });
}

