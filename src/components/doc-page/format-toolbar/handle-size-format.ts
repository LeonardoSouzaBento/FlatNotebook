export const handleSizeFormat = (
  className: string,
  setActiveSize: (size: string | null) => void
) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const pNode = selection.anchorNode?.parentElement?.closest(
    'p[contenteditable="true"]',
  );
  if (!pNode) return;

  let inner = pNode.innerHTML;
  // Remove existing size spans
  const sizeSpanRegex =
    /<span[^>]*class="[^"]*(text-xs|text-sm|text-lg)[^"]*"[^>]*>(.*?)<\/span>/gi;
  let currentClass = "";
  const match = sizeSpanRegex.exec(inner);
  if (match) {
    currentClass = match[1];
  }
  inner = inner.replace(
    /<span[^>]*class="[^"]*(text-xs|text-sm|text-lg)[^"]*"[^>]*>(.*?)<\/span>/gi,
    "$2",
  );

  if (currentClass === className) {
    pNode.innerHTML = inner;
  } else {
    pNode.innerHTML = `<span class="${className}">${inner}</span>`;
  }

  (pNode as HTMLElement).blur();
  setActiveSize(currentClass === className ? null : className);
};
