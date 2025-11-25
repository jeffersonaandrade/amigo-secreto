import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Shuffle, Eye } from "lucide-react";
import { APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      {/* Header */}
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Meus Grupos</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Organize seu Amigo Secreto de forma simples e divertida! 🎄
          </h2>
          <p className="text-xl text-muted-foreground">
            Crie grupos, adicione participantes, realize o sorteio automático e compartilhe os resultados. 
            Tudo de forma gratuita e sem complicações!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Meus Grupos
                  </Button>
                </Link>
                <Link href="/create">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Criar Novo Grupo
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="lg" className="text-lg px-8">Começar Agora</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Adicione Participantes</CardTitle>
              <CardDescription>
                Insira manualmente os nomes de todos os participantes. Não é necessário que eles tenham conta!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shuffle className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Sorteio Automático</CardTitle>
              <CardDescription>
                Nosso algoritmo garante que ninguém tire a si mesmo e que todos tenham um amigo secreto!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Links Individuais</CardTitle>
              <CardDescription>
                Cada participante recebe um link único para ver quem tirou, mantendo o segredo!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>100% Gratuito</CardTitle>
              <CardDescription>
                Organize quantos grupos quiser, com quantos participantes precisar. Tudo grátis!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Como Funciona?</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Crie um Grupo</h3>
                <p className="text-muted-foreground">
                  Faça login e crie um novo grupo de amigo secreto com nome, descrição e valor sugerido para o presente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Adicione os Participantes</h3>
                <p className="text-muted-foreground">
                  Insira o nome de cada pessoa que vai participar. Opcionalmente, adicione email ou telefone para facilitar o contato.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Realize o Sorteio</h3>
                <p className="text-muted-foreground">
                  Com um clique, nosso sistema sorteia automaticamente os pares, garantindo que ninguém tire a si mesmo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Compartilhe os Links</h3>
                <p className="text-muted-foreground">
                  Cada participante recebe um link único. Ao acessar, verá apenas quem tirou, mantendo o segredo do amigo oculto!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2">
          <CardContent className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Organize seu amigo secreto em minutos!
            </p>
            {isAuthenticated ? (
              <Link href="/create">
                <Button size="lg" className="text-lg px-8">
                  Criar Meu Primeiro Grupo
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="text-lg px-8">Começar Gratuitamente</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>© 2024 {APP_TITLE}. Feito com ❤️ para o Natal 🎄</p>
        </div>
      </footer>
    </div>
  );
}
