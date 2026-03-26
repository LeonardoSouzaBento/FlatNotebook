export function formatText(text: string): string {
  // Bold Italic: ***text***
  let formatted = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Underline: __text__
  formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
  // Upper: [upper]text[/upper]
  formatted = formatted.replace(/\[upper\](.*?)\[\/upper\]/gs, '<span class="uppercase">$1</span>');
  // Capitalize: [capitalize]text[/capitalize]
  formatted = formatted.replace(/\[capitalize\](.*?)\[\/capitalize\]/gs, '<span class="capitalize">$1</span>');
  
  // Italic: *text* (but not bold)
  // To avoid matching bold we could check if it is already strong, 
  // but a simple regex with lookarounds or negative lookbehind can be tricky.
  // Actually, standard regex for single asterisks is:
  formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Sizes
  formatted = formatted.replace(/\[big\](.*?)\[\/big\]/gs, '<span class="text-lg">$1</span>');
  formatted = formatted.replace(/\[small\](.*?)\[\/small\]/gs, '<span class="text-sm">$1</span>');
  formatted = formatted.replace(/\[extra-small\](.*?)\[\/extra-small\]/gs, '<span class="text-xs">$1</span>');

  return formatted;
}

export function parseHtmlToFormat(html: string): string {
  let parsed = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__')
    .replace(/<span[^>]*class="[^"]*uppercase[^"]*"[^>]*>(.*?)<\/span>/gi, '[upper]$1[/upper]')
    .replace(/<span[^>]*class="[^"]*capitalize[^"]*"[^>]*>(.*?)<\/span>/gi, '[capitalize]$1[/capitalize]')
    .replace(/<span[^>]*class="[^"]*text-lg[^"]*"[^>]*>(.*?)<\/span>/gi, '[big]$1[/big]')
    .replace(/<span[^>]*class="[^"]*text-sm[^"]*"[^>]*>(.*?)<\/span>/gi, '[small]$1[/small]')
    .replace(/<span[^>]*class="[^"]*text-xs[^"]*"[^>]*>(.*?)<\/span>/gi, '[extra-small]$1[/extra-small]');

  // Strip other HTML tags that might be added by contentEditable
  parsed = parsed.replace(/<br\s*[/]?>/gi, '\n');
  parsed = parsed.replace(/<[^>]+>/gi, '');

  return parsed;
}
