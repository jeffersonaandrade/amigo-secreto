import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { APP_TITLE } from "@/const";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export default function AllResults() {
  const { id } = useParams<{ id: string }>();
  const groupId = id || "";
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data: results, isLoading } = trpc.draw.viewAll.useQuery(
    { groupId },
    { enabled: isAuthenticated && !!groupId }
  );

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

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-semibold mb-2">Resultados não disponíveis</h3>
            <p className="text-muted-foreground mb-6">
              Não foi possível carregar os resultados do sorteio.
            </p>
            <Link href={`/group/${groupId}`}>
              <Button>Voltar ao Grupo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h2 className="text-4xl font-bold mb-2">Resultados do Sorteio</h2>
            <p className="text-muted-foreground">
              Confira quem tirou quem no amigo secreto
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todos os Pares</CardTitle>
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
