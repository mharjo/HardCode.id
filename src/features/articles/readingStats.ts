/** Strips tags/entities and counts words in an HTML string, mirroring SOURCE's `calculateArticleWordCount`. */
export function countWords(html: string): number {
  const plainText = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

  if (!plainText) return 0;
  const tokens = plainText.match(/[\wÀ-ɏḀ-ỿ-]+/g);
  return tokens ? tokens.length : 0;
}
