"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, ArrowLeft } from "lucide-react";
import { APP_TITLE } from "@/const";
import Link from "next/link";

export default function Privacidade() {
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
              Política de Privacidade
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                1. Informações que Coletamos
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Coletamos as seguintes informações quando você usa o {APP_TITLE}:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li><strong>Informações de autenticação:</strong> Quando você faz login com Google, coletamos seu email e nome (se disponível)</li>
                <li><strong>Dados dos grupos:</strong> Informações sobre os grupos de amigo secreto que você cria, incluindo nomes, descrições e participantes</li>
                <li><strong>Dados de uso:</strong> Informações sobre como você usa o serviço, incluindo data e hora de acesso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                2. Como Usamos suas Informações
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Usamos as informações coletadas para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Fornecer, manter e melhorar nosso serviço</li>
                <li>Processar e gerenciar seus grupos de amigo secreto</li>
                <li>Realizar sorteios automáticos</li>
                <li>Enviar notificações relacionadas ao serviço</li>
                <li>Detectar e prevenir fraudes ou uso indevido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                3. Compartilhamento de Informações
              </h2>
              <p className="text-foreground leading-relaxed">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4 mt-4">
                <li>Quando necessário para fornecer o serviço (por exemplo, com provedores de serviços como Firebase)</li>
                <li>Quando exigido por lei ou processo legal</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                4. Segurança dos Dados
              </h2>
              <p className="text-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações 
                contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão 
                pela Internet é 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                5. Seus Direitos
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Retirar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                6. Cookies e Tecnologias Similares
              </h2>
              <p className="text-foreground leading-relaxed">
                Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e 
                personalizar conteúdo. Você pode controlar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-red mb-4">
                7. Alterações nesta Política
              </h2>
              <p className="text-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações 
                significativas publicando a nova política nesta página e atualizando a data de "última atualização".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-christmas text-christmas-green mb-4">
                8. Contato
              </h2>
              <p className="text-foreground leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através dos canais 
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

