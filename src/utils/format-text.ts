export function formatText(text: string): string {
  // Bold Italic: ***text***
  let formatted = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Underline: __text__
  formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // Italic: *text* (but not bold)
  // To avoid matching bold we could check if it is already strong, 
  // but a simple regex with lookarounds or negative lookbehind can be tricky.
  // Actually, standard regex for single asterisks is:
  formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  return formatted;
}

export function parseHtmlToFormat(html: string): string {
  let parsed = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');

  // Strip other HTML tags that might be added by contentEditable
  parsed = parsed.replace(/<br\s*[/]?>/gi, '\n');
  parsed = parsed.replace(/<[^>]+>/gi, '');

  return parsed;
}
