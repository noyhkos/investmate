/**
 * Quote currency inferred from the symbol. Yahoo does not return it on every
 * search hit, and the KRW toggle needs to know what it is converting from.
 */
export function guessCurrency(symbol: string): string {
  if (symbol.endsWith(".KS") || symbol.endsWith(".KQ")) return "KRW";
  if (symbol.endsWith(".T")) return "JPY";
  if (symbol.endsWith(".L")) return "GBP";
  if (symbol.endsWith("=X")) return "KRW";
  const crypto = /-([A-Z]{3})$/.exec(symbol);
  if (crypto) return crypto[1];
  return "USD";
}
