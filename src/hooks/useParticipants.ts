"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as firestore from "@/lib/firestore";
import type { Participant, InsertParticipant } from "@shared/types";
import { toast } from "sonner";
import { isClient, safeUseQueryClient } from "./_helpers";

export function useParticipants(groupId: string | null) {
  // Durante o build, retorna valores mock
  if (!isClient) {
    return {
      participants: [],
      isLoading: false,
      addParticipant: async () => ({} as any),
      removeParticipant: async () => {},
      isAdding: false,
      isRemoving: false,
    };
  }

  const queryClient = safeUseQueryClient();

  const participantsQuery = useQuery({
    queryKey: ["participants", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      return firestore.getParticipantsByGroup(groupId);
    },
    enabled: !!groupId,
  });

  const addParticipantMutation = useMutation({
    mutationFn: async (data: Omit<InsertParticipant, "accessToken">) => {
      if (!groupId) throw new Error("ID do grupo não fornecido");
      
      // Gerar token de acesso único
      const accessToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
      
      return firestore.createParticipant({
        ...data,
        groupId,
        accessToken,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", groupId] });
      toast.success("Participante adicionado!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar participante");
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      await firestore.deleteParticipant(participantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", groupId] });
      toast.success("Participante removido!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover participante");
    },
  });

  return {
    participants: participantsQuery.data ?? [],
    isLoading: participantsQuery.isLoading,
    addParticipant: addParticipantMutation.mutateAsync,
    removeParticipant: removeParticipantMutation.mutateAsync,
    isAdding: addParticipantMutation.isPending,
    isRemoving: removeParticipantMutation.isPending,
  };
}

export function useParticipantByToken(token: string | null) {
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
    queryKey: ["participant", token],
    queryFn: async () => {
      if (!token) return null;
      return firestore.getParticipantByToken(token);
    },
    enabled: !!token,
  });
}

