import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico (string ou number) como moeda brasileira (R$)
 * @param value - Valor numérico em REAIS (não centavos). Ex: 50.00 = R$ 50,00
 * @returns String formatada como "R$ 0,00"
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (!value) return "";
  
  // Converte para número
  let amount: number;
  
  if (typeof value === "string") {
    // Remove caracteres não numéricos, exceto ponto e vírgula
    const cleaned = value.replace(/[^\d.,]/g, "");
    // Se tem vírgula, assume formato brasileiro (50,00)
    if (cleaned.includes(",")) {
      amount = parseFloat(cleaned.replace(".", "").replace(",", "."));
    } else {
      // Se não tem vírgula, assume que é número direto
      amount = parseFloat(cleaned) || 0;
    }
  } else {
    amount = value;
  }
  
  if (isNaN(amount) || amount === 0) return "";
  
  // Formata como moeda brasileira (valor já está em reais)
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

