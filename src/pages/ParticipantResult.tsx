"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader2, Calendar, DollarSign } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useParticipantByToken } from "@/hooks/useParticipants";
import { useGroup } from "@/hooks/useGroups";
import { useParticipants } from "@/hooks/useParticipants";
import { useDrawForGiver } from "@/hooks/useDraw";
import { CircularWheel } from "@/components/CircularWheel";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function ParticipantResult() {
  const params = useParams();
  const token = params?.token ? (typeof params.token === "string" ? params.token : params.token[0] || "") : "";
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: participant, isLoading: participantLoading } = useParticipantByToken(token);
  const { group, isLoading: groupLoading } = useGroup(participant?.groupId || null);
  const { participants, isLoading: participantsLoading } = useParticipants(participant?.groupId || null);
  const { data: draw, isLoading: drawLoading } = useDrawForGiver(
    participant?.groupId || null,
    participant?.id || null
  );

  const isLoading = participantLoading || groupLoading || participantsLoading || drawLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent/20 to-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!participant || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent/20 to-background">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Link inválido</h3>
            <p className="text-muted-foreground mb-6">
              O link que você está tentando acessar não é válido ou expirou.
            </p>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allParticipants = participants.map(p => p.name);
  const drawn = draw && group.isDrawn 
    ? participants.find(p => p.id === draw.receiverId) || null
    : null;
  const message = !group.isDrawn 
    ? "O sorteio ainda não foi realizado"
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      {/* Header */}
      <header className="container py-6 border-b">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-christmas">{APP_TITLE}</h1>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-christmas">Olá, {participant.name}! 🎄</CardTitle>
              <CardDescription className="text-base">
                Você está participando do grupo: <span className="font-semibold text-foreground">{group.name}</span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Group Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-christmas">Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                  <p className="text-foreground">{group.description}</p>
                </div>
              )}
              {group.suggestedValue && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Sugerido</p>
                    <p className="font-semibold">{formatCurrency(group.suggestedValue)}</p>
                  </div>
                </div>
              )}
              {group.revealDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Evento</p>
                    <p className="font-semibold">
                      {new Date(group.revealDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Card with Spin Wheel */}
          {message ? (
            <Card className="border-2 border-muted">
              <CardContent className="py-12 text-center">
                <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Aguarde o Sorteio</h3>
                <p className="text-muted-foreground">
                  {message}
                </p>
              </CardContent>
            </Card>
          ) : drawn ? (
            <Card className="border-2 border-secondary/50 bg-gradient-to-br from-secondary/5 to-primary/5">
              <CardContent className="py-12">
                {!showDetails ? (
                  <CircularWheel
                    names={allParticipants || []}
                    winnerName={drawn.name}
                    onReveal={() => setShowDetails(true)}
                  />
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                        <Gift className="h-10 w-10 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Você tirou:</h3>
                      <div className="text-5xl font-bold text-secondary my-6">
                        {drawn.name}
                      </div>
                    </div>

                    {drawn.wishlist && (
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Lista de Desejos:</p>
                        <p className="text-foreground">{drawn.wishlist}</p>
                      </div>
                    )}

                    {(drawn.email || drawn.phone) && (
                      <div className="p-4 bg-background/50 rounded-lg space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Informações de Contato:</p>
                        {drawn.email && (
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold">{drawn.email}</p>
                          </div>
                        )}
                        {drawn.phone && (
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-semibold">{drawn.phone}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-accent/50 rounded-lg">
                      <p className="text-sm text-muted-foreground text-center">
                        🤫 Lembre-se: é um segredo! Não conte para ninguém quem você tirou.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t mt-12">
        <div className="text-center text-muted-foreground space-y-2">
          <p>🎄 Boas festas! 🎁</p>
          <p className="text-sm">
            © {new Date().getFullYear()} {APP_TITLE}. Criado por{" "}
            <a
              href="https://www.instagram.com/jeffersonaandrade10/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-christmas-red hover:text-christmas-red-dark hover:underline transition-colors font-semibold"
            >
              Jefferson Andrade
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
