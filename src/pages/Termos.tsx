"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, ArrowLeft } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";

export default function Termos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-christmas-red" />
            <h1 className="text-2xl font-bold font-christmas text-christmas-red">{APP_TITLE}</h1>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-4xl font-bold font-christmas text-christmas-green">
              Termos de Uso
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Ao acessar e usar o {APP_TITLE}, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concorda com qualquer parte destes termos, não deve usar nosso serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-foreground leading-relaxed">
                O {APP_TITLE} é uma plataforma online que permite aos usuários organizar sorteios de amigo secreto. 
                O serviço é fornecido gratuitamente e permite criar grupos, adicionar participantes e realizar sorteios automáticos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                3. Uso do Serviço
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Você concorda em usar o serviço apenas para fins legais e de acordo com estes Termos. Você não deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Usar o serviço para qualquer propósito ilegal ou não autorizado</li>
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Interferir ou interromper o serviço ou servidores conectados ao serviço</li>
                <li>Tentar obter acesso não autorizado ao serviço ou sistemas relacionados</li>
                <li>Usar o serviço para transmitir qualquer vírus ou código malicioso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                4. Conta do Usuário
              </h2>
              <p className="text-foreground leading-relaxed">
                Para usar certos recursos do serviço, você precisará criar uma conta usando autenticação do Google. 
                Você é responsável por manter a confidencialidade de sua conta e por todas as atividades que ocorrem sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                5. Privacidade
              </h2>
              <p className="text-foreground leading-relaxed">
                Sua privacidade é importante para nós. Por favor, revise nossa{" "}
                <Link href="/privacidade" className="text-christmas-red hover:underline font-semibold">
                  Política de Privacidade
                </Link>
                , que também rege o uso do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                6. Limitação de Responsabilidade
              </h2>
              <p className="text-foreground leading-relaxed">
                O {APP_TITLE} é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será 
                ininterrupto, seguro ou livre de erros. Você usa o serviço por sua conta e risco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                7. Modificações dos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Reservamos o direito de modificar estes Termos de Uso a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação. 
                O uso continuado do serviço após tais modificações constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                8. Contato
              </h2>
              <p className="text-foreground leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais 
                disponíveis na plataforma.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-12">
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

