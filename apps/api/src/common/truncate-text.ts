export function truncateText(text: string, maxLength: number = 120): string {
  if (!text) return '';
  if (maxLength <= 3) return text.slice(0, maxLength);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
