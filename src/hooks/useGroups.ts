"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import * as firestore from "@/lib/firestore";
import type { Group, InsertGroup } from "@shared/types";
import { toast } from "sonner";
import { isClient, safeUseQueryClient } from "./_helpers";

export function useGroups() {
  // Durante o build, retorna valores mock
  if (!isClient) {
    return {
      groups: [],
      isLoading: false,
      createGroup: async () => ({} as any),
      isCreating: false,
    };
  }

  const { user } = useAuth();
  const queryClient = safeUseQueryClient();

  const groupsQuery = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("[useGroups] Usuário não autenticado ou sem ID");
        return [];
      }
      console.log("[useGroups] Buscando grupos para creatorId:", user.id);
      try {
        const groups = await firestore.getGroupsByCreator(user.id);
        console.log("[useGroups] Grupos encontrados:", groups.length, groups);
        return groups;
      } catch (error) {
        console.error("[useGroups] Erro ao buscar grupos:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: Omit<InsertGroup, "creatorId" | "inviteCode" | "isDrawn">) => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      
      console.log("[useGroups] Criando grupo com creatorId:", user.id);
      console.log("[useGroups] Dados do grupo:", data);
      
      // Gerar código de convite
      const inviteCode = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
      
      const group = await firestore.createGroup({
        ...data,
        creatorId: user.id,
        inviteCode,
        isDrawn: false,
      });
      
      console.log("[useGroups] Grupo criado com sucesso:", group.id, "creatorId:", group.creatorId);
      return group;
    },
    onSuccess: () => {
      // Invalida todas as queries de grupos (incluindo a específica do usuário)
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      // Também força refetch imediato
      queryClient.refetchQueries({ queryKey: ["groups", user?.id] });
      toast.success("Grupo criado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar grupo");
    },
  });

  return {
    groups: groupsQuery.data ?? [],
    isLoading: groupsQuery.isLoading,
    createGroup: createGroupMutation.mutateAsync,
    isCreating: createGroupMutation.isPending,
  };
}

export function useGroup(groupId: string | null) {
  // Durante o build, retorna valores mock
  if (!isClient) {
    return {
      group: null,
      isLoading: false,
      updateGroup: async () => {},
      deleteGroup: async () => {},
      isUpdating: false,
      isDeleting: false,
    };
  }

  const queryClient = safeUseQueryClient();
  const { user } = useAuth();

  const groupQuery = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!groupId) return null;
      return firestore.getGroupById(groupId);
    },
    enabled: !!groupId,
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (updates: Partial<InsertGroup>) => {
      if (!groupId) throw new Error("ID do grupo não fornecido");
      await firestore.updateGroup(groupId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast.success("Grupo atualizado!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar grupo");
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      if (!groupId) throw new Error("ID do grupo não fornecido");
      await firestore.deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Grupo deletado!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar grupo");
    },
  });

  return {
    group: groupQuery.data,
    isLoading: groupQuery.isLoading,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
}

