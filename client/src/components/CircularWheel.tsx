import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CircularWheelProps {
  names: string[];
  winnerName: string;
  onReveal: () => void;
}

export function CircularWheel({ names, winnerName, onReveal }: CircularWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const segmentAngle = 360 / names.length;

  const handleSpin = () => {
    if (isSpinning) return;

    setHasStarted(true);
    setIsSpinning(true);

    const winnerIndex = names.indexOf(winnerName);
    
    // CONFIGURAÇÃO DA FÍSICA
    const voltasMinimas = 5; // Quantas voltas completas vai dar
    const anguloPorFatia = 360 / names.length; // Ex: 60 graus para 6 participantes
    
    // O PULO DO GATO 🐱
    // 1. (voltasMinimas * 360): Garante que gira bastante
    // 2. -(winnerIndex * anguloPorFatia): Gira "para trás" para buscar o índice
    // 3. -(anguloPorFatia / 2): Centraliza o ponteiro no meio do texto
    const finalRotation = (voltasMinimas * 360) - (winnerIndex * anguloPorFatia) - (anguloPorFatia / 2);

    // Animar a rotação
    setRotation(finalRotation);

    // Após a animação, revelar
    setTimeout(() => {
      setIsSpinning(false);
      setRevealed(true);
      onReveal();
    }, 5000); // 5 segundos de animação
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {!hasStarted && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Pronto para descobrir quem você tirou?
          </h2>
          <p className="text-gray-600">
            Clique no botão abaixo para girar a roleta!
          </p>
        </div>
      )}

      {hasStarted && (
        <>
          {isSpinning && (
            <p className="text-lg font-semibold text-christmas-red animate-pulse">
              Girando a roleta... ✨
            </p>
          )}
          {revealed && (
            <div className="text-center space-y-2 animate-fade-in">
              <p className="text-xl font-bold text-christmas-green">
                🎉 Você tirou: {winnerName}! 🎉
              </p>
            </div>
          )}
        </>
      )}

      {/* Roleta Circular */}
      <div className="relative w-[400px] h-[400px]">
        {/* Ponteiro/Seta no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-2xl" />
        </div>

        {/* Container da Roleta */}
        <div className="relative w-full h-full">
          {/* Borda Externa Decorativa */}
          <div className="absolute inset-0 rounded-full border-8 border-christmas-gold shadow-2xl" />

          {/* Roleta Girando */}
          <svg
            className="w-full h-full"
            viewBox="0 0 400 400"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {names.map((name, index) => {
              const startAngle = index * segmentAngle - 90; // -90 para começar do topo
              const endAngle = startAngle + segmentAngle;
              
              // Converter ângulos para radianos
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              // Calcular pontos do arco
              const radius = 200;
              const centerX = 200;
              const centerY = 200;
              
              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);
              
              // Cor alternada
              const color = index % 2 === 0 ? "#DC2626" : "#16A34A"; // red-600 : green-600
              
              // Ângulo do meio do segmento para posicionar o texto
              const midAngle = startAngle + segmentAngle / 2;
              const midRad = (midAngle * Math.PI) / 180;
              const textRadius = 140; // Distância do centro para o texto
              const textX = centerX + textRadius * Math.cos(midRad);
              const textY = centerY + textRadius * Math.sin(midRad);
              
              return (
                <g key={index}>
                  {/* Segmento da roleta */}
                  <path
                    d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth="2"
                  />
                  
                  {/* Texto do nome */}
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
            
            {/* Centro da Roleta */}
            <circle cx="200" cy="200" r="50" fill="white" stroke="#D97706" strokeWidth="4" />
            <text x="200" y="210" fontSize="32" textAnchor="middle">🎁</text>
          </svg>
        </div>
      </div>

      {/* Botão de Girar */}
      {!hasStarted && (
        <Button
          onClick={handleSpin}
          size="lg"
          className="bg-gradient-to-r from-christmas-red to-red-700 hover:from-red-700 hover:to-christmas-red text-white font-bold text-xl px-12 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          🎰 GIRAR ROLETA 🎰
        </Button>
      )}

      {revealed && (
        <Button
          onClick={() => {
            setRotation(0);
            setIsSpinning(false);
            setHasStarted(false);
            setRevealed(false);
          }}
          variant="outline"
          className="border-2 border-christmas-green text-christmas-green hover:bg-christmas-green hover:text-white"
        >
          🔄 Girar Novamente
        </Button>
      )}
    </div>
  );
}
