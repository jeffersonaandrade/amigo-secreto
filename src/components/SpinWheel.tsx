"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface SpinWheelProps {
  names: string[];
  winnerName: string;
  onReveal: () => void;
}

export function SpinWheel({ names, winnerName, onReveal }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Embaralhar nomes para a roleta
  const shuffledNames = [...names].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!isSpinning) return;

    let iterations = 0;
    const maxIterations = 30 + Math.floor(Math.random() * 20); // 30-50 iterações
    let currentSpeed = 50; // Velocidade inicial (ms)
    const minSpeed = 50;
    const maxSpeed = 300;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledNames.length);
      iterations++;

      // Desacelerar gradualmente
      if (iterations > maxIterations * 0.6) {
        currentSpeed = Math.min(
          maxSpeed,
          currentSpeed + (maxSpeed - minSpeed) / (maxIterations * 0.4)
        );
      }

      // Parar na última iteração no nome vencedor
      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Garantir que para no nome vencedor
        const winnerIndex = shuffledNames.indexOf(winnerName);
        if (winnerIndex !== -1) {
          setCurrentIndex(winnerIndex);
        }
        setTimeout(() => {
          setIsSpinning(false);
          setRevealed(true);
        }, 500);
      }
    }, currentSpeed);

    return () => clearInterval(interval);
  }, [isSpinning, shuffledNames, winnerName]);

  const handleSpin = () => {
    setHasStarted(true);
    setIsSpinning(true);
  };

  if (revealed) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mx-auto animate-pulse">
          <Gift className="h-16 w-16 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-muted-foreground">
            Você tirou:
          </h3>
          <div className="text-6xl font-bold text-secondary animate-in slide-in-from-bottom duration-500">
            {winnerName}
          </div>
        </div>
        <Button size="lg" onClick={onReveal} className="mt-8">
          Ver Detalhes
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">
          {!hasStarted
            ? "Pronto para descobrir quem você tirou?"
            : "Girando a roleta..."}
        </h3>
        <p className="text-muted-foreground">
          {!hasStarted
            ? "Clique no botão abaixo para girar a roleta!"
            : "Aguarde..."}
        </p>
      </div>

      {/* Roleta */}
      <div className="relative max-w-md mx-auto">
        {/* Container da roleta com borda decorativa */}
        <div className="relative p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-3xl border-4 border-primary/30 shadow-2xl">
          {/* Indicador (seta) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg"></div>
          </div>

          {/* Display da roleta */}
          <div className="bg-card rounded-2xl p-8 min-h-[200px] flex items-center justify-center border-2 border-border shadow-inner overflow-hidden">
            <div
              className={`text-5xl font-bold transition-all duration-200 ${
                isSpinning ? "text-muted-foreground" : "text-secondary"
              }`}
            >
              {shuffledNames[currentIndex]}
            </div>
          </div>

          {/* Decorações laterais */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-4xl animate-bounce">
            🎄
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-4xl animate-bounce delay-150">
            🎁
          </div>
        </div>

        {/* Lista de nomes rolando (efeito visual) */}
        {isSpinning && (
          <div className="mt-4 flex gap-2 justify-center flex-wrap animate-pulse">
            {shuffledNames.map((name, idx) => (
              <span
                key={idx}
                className={`text-sm px-3 py-1 rounded-full ${
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botão de girar */}
      {!hasStarted && (
        <Button
          size="lg"
          onClick={handleSpin}
          className="text-xl px-12 py-6 animate-pulse hover:animate-none"
        >
          🎰 Girar a Roleta!
        </Button>
      )}

      {isSpinning && (
        <div className="text-muted-foreground animate-pulse">
          ✨ A roleta está girando... ✨
        </div>
      )}
    </div>
  );
}
