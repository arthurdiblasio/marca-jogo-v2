export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9s]/g, '')
    .trim()
    .replace(/s+/g, '-')
    .replace(/-+/g, '-');
}
