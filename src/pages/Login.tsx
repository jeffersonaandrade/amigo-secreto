"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginWithGoogle } from "@/_core/hooks/useAuth";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_TITLE } from "@/const";
import { Gift, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Chrome } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [buttonLoading, setButtonLoading] = useState(false);

  // Redireciona automaticamente se já estiver logado (inclusive quando volta do Google)
  useEffect(() => {
    console.log("[Login] Estado atual:", { authLoading, user: user ? `Usuário: ${user.email}` : "null" });
    if (!authLoading && user) {
      console.log("[Login] Redirecionando para /dashboard...");
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    setButtonLoading(true);
    try {
      // signInWithRedirect vai redirecionar a página, então não há return aqui
      // O redirecionamento para o dashboard será feito automaticamente após o login
      await loginWithGoogle();
      // Esta linha não será executada porque a página será redirecionada
    } catch (error: any) {
      console.error("Erro ao iniciar login com Google:", error);
      
      // Mensagens de erro mais específicas
      let errorMessage = "Erro ao fazer login com Google";
      
      if (error.code === "auth/unauthorized-domain") {
        errorMessage = "Domínio não autorizado. Verifique as configurações do Firebase.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Login com Google não está habilitado no Firebase.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setButtonLoading(false);
    }
    // Nota: setButtonLoading(false) não é necessário no finally porque a página será redirecionada
  };

  // Se estiver carregando (verificando a volta do Google), mostra tela de loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent/20 to-background relative overflow-hidden">
        {/* Textura de pinheiro no background */}
        <div className="absolute inset-0 opacity-[0.03] z-0">
          <Image
            src="/images/pinheiro-textura.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Card className="w-full max-w-md relative z-10">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-christmas-red" />
              <div className="space-y-2">
                <p className="text-xl font-bold font-christmas text-christmas-green animate-pulse">
                  Verificando credenciais... 🎅
                </p>
                <p className="text-sm text-muted-foreground">
                  Aguarde enquanto processamos seu login
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent/20 to-background p-4 relative overflow-hidden">
      {/* Textura de pinheiro no background */}
      <div className="absolute inset-0 opacity-[0.03] z-0">
        <Image
          src="/images/pinheiro-textura.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center relative">
          <Link 
            href="/" 
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            title="Voltar para a página inicial"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm hidden sm:inline">Voltar</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="h-8 w-8 text-christmas-red" />
            <CardTitle className="text-3xl font-bold font-christmas text-christmas-red">{APP_TITLE}</CardTitle>
          </div>
          <CardDescription>
            Entre com sua conta Google para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-md"
            onClick={handleGoogleLogin}
            disabled={buttonLoading}
            size="lg"
          >
            {buttonLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecionando...
              </>
            ) : (
              <>
                <Chrome className="mr-2 h-5 w-5" />
                Continuar com Google
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/termos" className="text-christmas-red hover:underline">
              termos de uso
            </Link>
            {" "}e{" "}
            <Link href="/privacidade" className="text-christmas-red hover:underline">
              política de privacidade
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

