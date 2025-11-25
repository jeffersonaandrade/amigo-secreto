"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_TITLE } from "@/const";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-lg shadow-lg border-2 border-border">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-christmas-red/20 rounded-full animate-pulse" />
              <Gift className="relative h-20 w-20 text-christmas-red" />
            </div>
          </div>

          <h1 className="text-6xl font-bold font-christmas text-christmas-red mb-4">404</h1>

          <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
            Página Não Encontrada
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
            Ops! Parece que esta página não existe ou foi movida.
            <br />
            Que tal voltar para a página inicial e continuar organizando seu amigo secreto? 🎄
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-christmas-red hover:bg-christmas-red-dark text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-christmas-green text-christmas-green hover:bg-christmas-green/10 px-8 py-3 rounded-full"
              >
                Ir para Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Precisa de ajuda? <Link href="/" className="text-christmas-red hover:underline">Volte para a página inicial</Link>
            </p>
            <p className="text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}

