import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Loader2, ArrowLeft } from "lucide-react";
import { APP_TITLE } from "@/const";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateGroup() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedValue, setSuggestedValue] = useState("");
  const [revealDate, setRevealDate] = useState("");

  const createMutation = trpc.groups.create.useMutation({
    onSuccess: (data) => {
      toast.success("Grupo criado com sucesso!");
      setLocation(`/group/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar grupo");
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para o grupo");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      suggestedValue: suggestedValue.trim() || undefined,
      revealDate: revealDate ? new Date(revealDate) : undefined,
    });
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
              Voltar
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Criar Novo Grupo</h2>
            <p className="text-muted-foreground">
              Preencha as informações do seu grupo de amigo secreto
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Grupo</CardTitle>
              <CardDescription>
                Defina o nome, descrição e detalhes do seu amigo secreto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nome do Grupo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Amigo Secreto da Família 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Adicione detalhes sobre o evento, local, horário, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suggestedValue">Valor Sugerido (opcional)</Label>
                  <Input
                    id="suggestedValue"
                    placeholder="Ex: R$ 50,00"
                    value={suggestedValue}
                    onChange={(e) => setSuggestedValue(e.target.value)}
                    maxLength={100}
                  />
                  <p className="text-sm text-muted-foreground">
                    Sugestão de valor para os presentes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revealDate">Data do Evento (opcional)</Label>
                  <Input
                    id="revealDate"
                    type="date"
                    value={revealDate}
                    onChange={(e) => setRevealDate(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Data em que os presentes serão trocados
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar Grupo"
                    )}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
