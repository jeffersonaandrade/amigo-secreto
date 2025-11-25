import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gift, Loader2, ArrowLeft, Plus, Trash2, Shuffle, Eye, Copy, Check, Users as UsersIcon } from "lucide-react";
import { APP_TITLE } from "@/const";
import { Link, useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = id || "";
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantPhone, setParticipantPhone] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data: group, isLoading: groupLoading } = trpc.groups.getById.useQuery(
    { id: groupId },
    { enabled: isAuthenticated && !!groupId }
  );

  const { data: participants, isLoading: participantsLoading } = trpc.participants.list.useQuery(
    { groupId },
    { enabled: isAuthenticated && !!groupId }
  );

  const addParticipantMutation = trpc.participants.add.useMutation({
    onSuccess: () => {
      toast.success("Participante adicionado!");
      setIsAddDialogOpen(false);
      setParticipantName("");
      setParticipantEmail("");
      setParticipantPhone("");
      utils.participants.list.invalidate({ groupId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar participante");
    },
  });

  const removeParticipantMutation = trpc.participants.remove.useMutation({
    onSuccess: () => {
      toast.success("Participante removido!");
      utils.participants.list.invalidate({ groupId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover participante");
    },
  });

  const performDrawMutation = trpc.draw.perform.useMutation({
    onSuccess: () => {
      toast.success("Sorteio realizado com sucesso!");
      utils.groups.getById.invalidate({ id: groupId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar sorteio");
    },
  });

  const redoDrawMutation = trpc.draw.redo.useMutation({
    onSuccess: () => {
      toast.success("Sorteio resetado! Você pode realizar um novo sorteio.");
      utils.groups.getById.invalidate({ id: groupId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao resetar sorteio");
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || !isAuthenticated || groupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-semibold mb-2">Grupo não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              O grupo que você está procurando não existe ou foi removido.
            </p>
            <Link href="/dashboard">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participantName.trim()) {
      toast.error("Por favor, insira o nome do participante");
      return;
    }

    addParticipantMutation.mutate({
      groupId,
      name: participantName.trim(),
      email: participantEmail.trim() || undefined,
      phone: participantPhone.trim() || undefined,
    });
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (confirm("Tem certeza que deseja remover este participante?")) {
      removeParticipantMutation.mutate({ groupId, participantId });
    }
  };

  const handlePerformDraw = () => {
    if (confirm("Tem certeza que deseja realizar o sorteio? Esta ação não pode ser desfeita facilmente.")) {
      performDrawMutation.mutate({ groupId });
    }
  };

  const handleRedoDraw = () => {
    if (confirm("Tem certeza que deseja refazer o sorteio? Todos os resultados atuais serão perdidos.")) {
      redoDrawMutation.mutate({ groupId });
    }
  };

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getParticipantLink = (token: string) => {
    return `${window.location.origin}/result/${token}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      {/* Header */}
      <header className="container py-6 border-b">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Gift className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">{APP_TITLE}</h1>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Meus Grupos
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Group Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{group.name}</CardTitle>
                  {group.description && (
                    <CardDescription className="text-base">{group.description}</CardDescription>
                  )}
                </div>
                {group.isDrawn ? (
                  <div className="px-4 py-2 bg-secondary/20 text-secondary font-semibold rounded-full">
                    Sorteado
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-muted text-muted-foreground font-semibold rounded-full">
                    Pendente
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {group.suggestedValue && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Sugerido</p>
                    <p className="font-semibold">{group.suggestedValue}</p>
                  </div>
                )}
                {group.revealDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Evento</p>
                    <p className="font-semibold">
                      {new Date(group.revealDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-6 w-6" />
                    Participantes ({participants?.length || 0})
                  </CardTitle>
                  <CardDescription>
                    Gerencie os participantes do grupo
                  </CardDescription>
                </div>
                {!group.isDrawn && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Participante</DialogTitle>
                        <DialogDescription>
                          Insira as informações do participante
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddParticipant} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            placeholder="Nome completo"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email (opcional)</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={participantEmail}
                            onChange={(e) => setParticipantEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone (opcional)</Label>
                          <Input
                            id="phone"
                            placeholder="(00) 00000-0000"
                            value={participantPhone}
                            onChange={(e) => setParticipantPhone(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1" disabled={addParticipantMutation.isPending}>
                            {addParticipantMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adicionando...
                              </>
                            ) : (
                              "Adicionar"
                            )}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {participantsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : participants && participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{participant.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {participant.email && <span>{participant.email}</span>}
                          {participant.phone && <span>{participant.phone}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {group.isDrawn && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => copyToClipboard(getParticipantLink(participant.accessToken), participant.accessToken)}
                          >
                            {copiedToken === participant.accessToken ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar Link
                              </>
                            )}
                          </Button>
                        )}
                        {!group.isDrawn && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveParticipant(participant.id)}
                            disabled={removeParticipantMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UsersIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum participante adicionado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
              <CardDescription>
                Gerencie o sorteio do grupo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!group.isDrawn ? (
                <div>
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={handlePerformDraw}
                    disabled={!participants || participants.length < 2 || performDrawMutation.isPending}
                  >
                    {performDrawMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sorteando...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-5 w-5" />
                        Realizar Sorteio
                      </>
                    )}
                  </Button>
                  {participants && participants.length < 2 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      É necessário pelo menos 2 participantes para realizar o sorteio
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Link href={`/group/${groupId}/results`}>
                    <Button size="lg" className="w-full gap-2" variant="secondary">
                      <Eye className="h-5 w-5" />
                      Ver Todos os Resultados
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleRedoDraw}
                    disabled={redoDrawMutation.isPending}
                  >
                    {redoDrawMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Resetando...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-5 w-5" />
                        Refazer Sorteio
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
