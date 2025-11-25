"use client";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGroup } from "@/hooks/useGroups";
import { useParticipants } from "@/hooks/useParticipants";
import { useDraw } from "@/hooks/useDraw";
import { useEffect } from "react";

export default function AllResults() {
  const params = useParams();
  const id = params?.id ? (typeof params.id === "string" ? params.id : params.id[0] || "") : "";
  const groupId = id || "";
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  const { group, isLoading: groupLoading } = useGroup(groupId);
  const { participants, isLoading: participantsLoading } = useParticipants(groupId);
  const { draws, isLoading: drawsLoading } = useDraw(groupId);

  const isLoading = groupLoading || participantsLoading || drawsLoading;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!group || !group.isDrawn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-semibold mb-2">Sorteio não realizado</h3>
            <p className="text-muted-foreground mb-6">
              O sorteio ainda não foi realizado para este grupo.
            </p>
            <Link href={`/group/${groupId}`}>
              <Button>Voltar ao Grupo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (group.creatorId !== user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-semibold mb-2">Acesso negado</h3>
            <p className="text-muted-foreground mb-6">
              Apenas o criador do grupo pode ver todos os resultados.
            </p>
            <Link href={`/group/${groupId}`}>
              <Button>Voltar ao Grupo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Montar resultados
  const results = draws.map(draw => {
    const giver = participants.find(p => p.id === draw.giverId);
    const receiver = participants.find(p => p.id === draw.receiverId);
    
    return {
      giver: giver?.name || "Desconhecido",
      receiver: receiver?.name || "Desconhecido",
      receiverWishlist: receiver?.wishlist || null,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      {/* Header */}
      <header className="container py-6 border-b">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Gift className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary font-christmas">{APP_TITLE}</h1>
            </div>
          </Link>
          <Link href={`/group/${groupId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Grupo
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 font-christmas">Resultados do Sorteio</h2>
            <p className="text-muted-foreground">
              Confira quem tirou quem no amigo secreto
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-christmas">Todos os Pares</CardTitle>
              <CardDescription>
                Lista completa de quem tirou quem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{result.giver}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ArrowRight className="h-5 w-5" />
                      <span className="text-sm">tirou</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-semibold text-lg text-secondary">{result.receiver}</p>
                      {result.receiverWishlist && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Deseja: {result.receiverWishlist}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              🔒 Estas informações são confidenciais. Compartilhe apenas os links individuais com cada participante.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
