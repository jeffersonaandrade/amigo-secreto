"use client";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Plus, Calendar, Users as UsersIcon, Loader2 } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";
import { useGroups } from "@/hooks/useGroups";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { groups, isLoading } = useGroups();

  // Debug: Verificar estado do usuário e grupos
  useEffect(() => {
    console.log("[Dashboard] Estado do usuário:", {
      user: user ? { id: user.id, email: user.email, name: user.name } : null,
      isAuthenticated,
      authLoading,
    });
    console.log("[Dashboard] Estado dos grupos:", {
      groups: groups?.length || 0,
      isLoading,
      grupos: groups,
    });
  }, [user, isAuthenticated, authLoading, groups, isLoading]);

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, <span className="font-semibold text-foreground">{user?.name || user?.email}</span>
            </span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 font-christmas">Meus Grupos</h2>
            <p className="text-muted-foreground">
              Gerencie seus grupos de amigo secreto
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Grupo
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/group/${group.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{group.name}</CardTitle>
                      {group.description && (
                        <CardDescription className="line-clamp-2">
                          {group.description}
                        </CardDescription>
                      )}
                    </div>
                    {group.isDrawn ? (
                      <div className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded-full">
                        Sorteado
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                        Pendente
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {group.suggestedValue && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Gift className="h-4 w-4" />
                        <span>Valor sugerido: {formatCurrency(group.suggestedValue)}</span>
                      </div>
                    )}
                    {group.revealDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Data: {new Date(group.revealDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Criado em {new Date(group.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/group/${group.id}`);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Layout Dividido: Imagem à esquerda, conteúdo à direita (Desktop) */}
              <div className="flex flex-col md:flex-row items-stretch min-h-[400px] md:min-h-[500px]">
                {/* Seção da Imagem - Esquerda (Desktop) / Topo (Mobile) */}
                <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-christmas-green/10 to-christmas-red/10">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/presentes-empilhados.jpg"
                      alt="Presentes empilhados"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent md:bg-gradient-to-br md:from-transparent md:via-transparent md:to-background/30" />
                  </div>
                </div>

                {/* Seção do Conteúdo - Direita (Desktop) / Abaixo (Mobile) */}
                <div className="flex-1 flex flex-col justify-center items-center text-center md:text-left p-8 md:p-12">
                  <div className="max-w-md">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 font-christmas text-christmas-green">
                      Nenhum grupo criado ainda
                    </h3>
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                      Crie seu primeiro grupo de amigo secreto e comece a organizar! Sua pilha de presentes está esperando por você.
                    </p>
                    <Link href="/create" className="inline-block">
                      <Button size="lg" className="gap-2 bg-christmas-red hover:bg-christmas-red-dark text-white shadow-lg hover:shadow-xl transition-all">
                        <Plus className="h-5 w-5" />
                        Criar Primeiro Grupo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
