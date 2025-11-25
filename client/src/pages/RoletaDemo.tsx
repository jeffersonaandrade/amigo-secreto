import { useState } from "react";
import { CircularWheel } from "@/components/CircularWheel";

export default function RoletaDemo() {
  const [revealed, setRevealed] = useState(false);

  // Dados de demonstração
  const demoData = {
    participant: {
      name: "Maria Silva"
    },
    drawnParticipant: {
      name: "João Santos",
      email: "joao@email.com",
      phone: "(11) 98765-4321",
      wishlist: "Livros, chocolates, caneca personalizada"
    },
    group: {
      name: "Amigo Secreto da Família 2024",
      description: "Encontro dia 25/12 às 19h na casa da vovó",
      suggestedValue: "R$ 50,00",
      eventDate: "2024-12-25"
    },
    allParticipants: [
      { id: "1", name: "Maria Silva" },
      { id: "2", name: "João Santos" },
      { id: "3", name: "Pedro Costa" },
      { id: "4", name: "Ana Souza" },
      { id: "5", name: "Carlos Lima" },
      { id: "6", name: "Julia Oliveira" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-christmas-red mb-2">
            🎄 Amigo Secreto 2024 🎄
          </h1>
          <p className="text-lg text-gray-600">
            {demoData.group.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Olá, {demoData.participant.name}! 👋
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-christmas-gold">
          <CircularWheel
            names={demoData.allParticipants.map(p => p.name)}
            winnerName={demoData.drawnParticipant.name}
            onReveal={() => setRevealed(true)}
          />

          {revealed && (
            <div className="mt-8 space-y-4 animate-fade-in">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-yellow-300">
                <h3 className="font-semibold text-amber-900 mb-3 text-center">
                  🎁 Informações de {demoData.drawnParticipant.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {demoData.drawnParticipant.email && (
                    <p>📧 Email: {demoData.drawnParticipant.email}</p>
                  )}
                  {demoData.drawnParticipant.phone && (
                    <p>📱 Telefone: {demoData.drawnParticipant.phone}</p>
                  )}
                  {demoData.drawnParticipant.wishlist && (
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">
                        💝 Lista de desejos:
                      </p>
                      <p className="text-gray-600 italic">
                        {demoData.drawnParticipant.wishlist}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  📋 Informações do Evento
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>💰 Valor sugerido: {demoData.group.suggestedValue}</p>
                  <p>📅 Data: {new Date(demoData.group.eventDate).toLocaleDateString('pt-BR')}</p>
                  <p>📍 {demoData.group.description}</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200 text-center">
                <p className="text-red-800 font-semibold">
                  🤫 Lembre-se: mantenha o segredo até o dia do evento!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>✨ Demonstração da Roleta do Amigo Secreto ✨</p>
        </div>
      </div>
    </div>
  );
}
