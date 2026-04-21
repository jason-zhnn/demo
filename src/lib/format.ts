export function formatPages(pages: number): string {
  if (pages === 1) return "1 page";
  return `${pages} pages`;
}
