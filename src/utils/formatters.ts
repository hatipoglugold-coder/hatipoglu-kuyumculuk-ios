export function formatTurkishLira(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0,00';
  
  // Format with thousands separator as '.' and decimal separator as ','
  const parts = value.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1] !== undefined ? ',' + parts[1] : '';
  
  return `${integerPart}${decimalPart}`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return formatTurkishLira(value, decimals);
}

export function parseTurkishNumber(str: string): number {
  if (!str) return 0;
  // Convert "11.116,00" to 11116.00
  const normalized = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}
