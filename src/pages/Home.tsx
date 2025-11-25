"use client";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Shuffle, Eye } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";
import Image from "next/image";
import { useGroups } from "@/hooks/useGroups";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { groups, isLoading: groupsLoading } = useGroups();
  
  const hasGroups = groups && groups.length > 0;

  if (loading || groupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-christmas-red" />
            <h1 className="text-2xl font-bold font-christmas text-christmas-red">{APP_TITLE}</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-christmas-red text-white px-6 py-2 rounded-full hover:bg-christmas-red-dark transition-colors">
                  Meus Grupos
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-christmas-red text-white px-6 py-2 rounded-full hover:bg-christmas-red-dark transition-colors">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background Image - Cobre todo o hero */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/presente-papel-pardo.jpg"
            alt="Presente embrulhado em papel pardo com barbante vermelho"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Overlay escuro para melhor legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-christmas text-christmas-green mb-6">
              Organize seu Amigo Secreto de forma simples e divertida! 🎄
            </h2>
            <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
              Crie grupos, adicione participantes, realize o sorteio automático e compartilhe os resultados. 
              Tudo de forma gratuita e sem complicações!
            </p>
            <div className="flex gap-4 flex-wrap">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-christmas-red text-white px-8 py-4 rounded-full hover:bg-christmas-red-dark transition-colors shadow-lg">
                      Meus Grupos
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button size="lg" className="bg-christmas-green text-white px-8 py-4 rounded-full hover:bg-christmas-green-light transition-colors shadow-lg">
                      Criar Novo Grupo
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="bg-christmas-red text-white px-8 py-4 rounded-full hover:bg-christmas-red-dark transition-colors shadow-lg">
                    Começar Agora
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Image
                src="/images/pinheiro-textura.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <CardHeader className="relative z-10">
              <div className="bg-christmas-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-christmas-red" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 font-christmas">Adicione Participantes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Insira manualmente os nomes de todos os participantes. Não é necessário que eles tenham conta!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-christmas-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shuffle className="h-8 w-8 text-christmas-green" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 font-christmas">Sorteio Automático</CardTitle>
              <CardDescription className="text-muted-foreground">
                Nosso algoritmo garante que ninguém tire a si mesmo e que todos tenham um amigo secreto!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Image
                src="/images/pinheiro-textura.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <CardHeader className="relative z-10">
              <div className="bg-christmas-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-christmas-red" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 font-christmas">Links Individuais</CardTitle>
              <CardDescription className="text-muted-foreground">
                Cada participante recebe um link único para ver quem tirou, mantendo o segredo!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-christmas-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-christmas-green" />
              </div>
              <CardTitle className="text-xl font-bold mb-2 font-christmas">100% Gratuito</CardTitle>
              <CardDescription className="text-muted-foreground">
                Organize quantos grupos quiser, com quantos participantes precisar. Tudo grátis!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-christmas text-christmas-green text-center mb-12">Como Funciona?</h2>
          
          {/* Imagem decorativa - Mesa com decorações */}
          <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden shadow-lg mb-12">
            <Image
              src="/images/mesa-decoracoes.jpg"
              alt="Mesa de madeira com decorações natalinas"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-christmas-red text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-christmas">Crie um Grupo</h3>
                <p className="text-muted-foreground">
                  Faça login e crie um novo grupo de amigo secreto com nome, descrição e valor sugerido para o presente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-christmas-green text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-christmas">Adicione os Participantes</h3>
                <p className="text-muted-foreground">
                  Insira o nome de cada pessoa que vai participar. Opcionalmente, adicione email ou telefone para facilitar o contato.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-christmas-red text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-christmas">Realize o Sorteio</h3>
                <p className="text-muted-foreground">
                  Com um clique, nosso sistema sorteia automaticamente os pares, garantindo que ninguém tire a si mesmo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-christmas-green text-white flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-christmas">Compartilhe os Links</h3>
                <p className="text-muted-foreground">
                  Cada participante recebe um link único. Ao acessar, verá apenas quem tirou, mantendo o segredo do amigo oculto!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-christmas-red/10 via-christmas-green/10 to-christmas-red/10 border-2 border-border">
          <CardContent className="py-12 text-center">
            {isAuthenticated && hasGroups ? (
              <>
                <h2 className="text-4xl font-bold font-christmas text-christmas-green mb-4">Quer criar mais um grupo?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Organize outro amigo secreto e continue a diversão! 🎁
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/create">
                    <Button size="lg" className="bg-christmas-red text-white px-8 py-4 rounded-full hover:bg-christmas-red-dark transition-colors text-lg">
                      Criar Novo Grupo
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="px-8 py-4 rounded-full text-lg border-2">
                      Ver Meus Grupos
                    </Button>
                  </Link>
                </div>
              </>
            ) : isAuthenticated ? (
              <>
                <h2 className="text-4xl font-bold font-christmas text-christmas-green mb-4">Pronto para começar?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Organize seu amigo secreto em minutos!
                </p>
                <Link href="/create">
                  <Button size="lg" className="bg-christmas-red text-white px-8 py-4 rounded-full hover:bg-christmas-red-dark transition-colors text-lg">
                    Criar Meu Primeiro Grupo
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold font-christmas text-christmas-green mb-4">Pronto para começar?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Organize seu amigo secreto em minutos!
                </p>
                <Link href="/login">
                  <Button size="lg" className="bg-christmas-red text-white px-8 py-4 rounded-full hover:bg-christmas-red-dark transition-colors text-lg">
                    Começar Gratuitamente
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="text-center text-muted-foreground space-y-2">
          <p>© {new Date().getFullYear()} {APP_TITLE}. Feito com ❤️ para o Natal 🎄</p>
          <p className="text-sm">
            Criado por{" "}
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
