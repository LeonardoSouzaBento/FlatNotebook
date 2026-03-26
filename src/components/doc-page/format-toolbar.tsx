import { Button, Icon } from "@/ui";
import {
  AArrowDown,
  AArrowUp,
  Bold,
  CaseSensitive,
  CaseUpper,
  Italic,
  LucideIcon,
  Underline,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { handleFormat, handleSizeFormat } from "./format-toolbar/index";
import { FormatType } from "./format-toolbar/types";

interface FormatButton {
  type: FormatType;
  icon: LucideIcon;
  title: string;
  size: string;
}

interface SizeButton {
  icon: LucideIcon;
  var: string;
  tag: string;
  size: string;
}

const TEXT_TRANSFORM_BUTTONS: FormatButton[] = [
  {
    type: "capitalize",
    icon: CaseSensitive,
    title: "Capitalizado",
    size: "xl",
  },
  { type: "upper", icon: CaseUpper, title: "Maiúsculo", size: "xl" },
];

const SIZE_BUTTONS: SizeButton[] = [
  { icon: AArrowDown, var: "text-xs", tag: "extra-small", size: "lg" },
  { icon: AArrowDown, var: "text-sm", tag: "small", size: "xl" },
  { icon: AArrowUp, var: "text-lg", tag: "big", size: "2xl" },
];

const STYLE_BUTTONS: FormatButton[] = [
  { type: "bold", icon: Bold, title: "Negrito", size: "sm" },
  { type: "italic", icon: Italic, title: "Itálico", size: "sm" },
  { type: "underline", icon: Underline, title: "Sublinhado", size: "base" },
];

const checkFormat = (type: FormatType): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  let node: Node | null = selection.anchorNode;

  if (type === "upper" || type === "capitalize") {
    const className = type === "upper" ? "uppercase" : "capitalize";
    while (node && node.nodeName !== "DIV" && node.nodeName !== "P") {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList.contains(className)
      ) {
        return true;
      }
      node = node.parentNode;
    }
    if (!selection.isCollapsed) {
      const span = document.createElement("span");
      span.appendChild(selection.getRangeAt(0).cloneContents());
      if (span.querySelector(`span.${className}`)) {
        return true;
      }
    }
    return false;
  }

  const targetTag1 =
    type === "bold" ? "STRONG" : type === "italic" ? "EM" : "U";
  const targetTag2 = type === "bold" ? "B" : type === "italic" ? "I" : "U";

  while (node && node.nodeName !== "DIV" && node.nodeName !== "P") {
    if (node.nodeName === targetTag1 || node.nodeName === targetTag2)
      return true;
    node = node.parentNode;
  }

  if (!selection.isCollapsed) {
    const span = document.createElement("span");
    span.appendChild(selection.getRangeAt(0).cloneContents());
    if (
      span.querySelector(targetTag1.toLowerCase()) ||
      span.querySelector(targetTag2.toLowerCase())
    ) {
      return true;
    }
  }

  return false;
};

export function FormatToolbar() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isWholeParagraphSelected, setIsWholeParagraphSelected] =
    useState(false);
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [activeFormats, setActiveFormats] = useState<
    Record<FormatType, boolean>
  >({
    capitalize: false,
    upper: false,
    bold: false,
    italic: false,
    underline: false,
  });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      const node = selection.anchorNode;
      const isInContentEditable = node?.nodeType === Node.ELEMENT_NODE 
        ? (node as HTMLElement).closest('[contenteditable="true"]')
        : node?.parentElement?.closest('[contenteditable="true"]');

      if (!isInContentEditable) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let wholeParagraph = false;
      let currSize = null;
      const pNode =
        node?.parentElement?.closest('p[contenteditable="true"]') ||
        (node?.nodeName === "P" ? (node as Element) : null);
      if (
        pNode &&
        range.toString().trim() === pNode.textContent?.trim() &&
        range.toString().trim().length > 0
      ) {
        wholeParagraph = true;
        const match =
          /<span[^>]*class="[^"]*(text-xs|text-sm|text-lg)[^"]*"[^>]*>/i.exec(
            pNode.innerHTML,
          );
        if (match) {
          currSize = match[1];
        }
      }
      setIsWholeParagraphSelected(wholeParagraph);
      setActiveSize(currSize);

      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2 - 60,
      });
      setActiveFormats({
        capitalize: checkFormat("capitalize"),
        upper: checkFormat("upper"),
        bold: checkFormat("bold"),
        italic: checkFormat("italic"),
        underline: checkFormat("underline"),
      });
      setIsVisible(true);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-2 p-1 bg-background border rounded-md shadow-md animate-in fade-in"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {TEXT_TRANSFORM_BUTTONS.map(({ type, icon, title, size }) => (
        <Button
          variant={activeFormats[type] ? "secondary" : "transparent"}
          size="icon-sm"
          key={type}
          onClick={(e) => {
            e.preventDefault();
            handleFormat(type, checkFormat, setActiveFormats);
          }}
          title={title}
        >
          <Icon Icon={icon} size={size} strokeWidth="thin" className="mt-0.5" />
        </Button>
      ))}
      <div className="w-px h-4 bg-border mx-1" />

      {STYLE_BUTTONS.map(({ type, icon, title, size }, index) => (
        <Button
          variant={activeFormats[type] ? "secondary" : "transparent"}
          size="icon-sm"
          key={type}
          onClick={(e) => {
            e.preventDefault();
            handleFormat(type, checkFormat, setActiveFormats);
          }}
          title={title}
        >
          <Icon Icon={icon} size={size} strokeWidth="normal" />
        </Button>
      ))}

      {isWholeParagraphSelected && (
        <>
          <div className="w-px h-4 bg-border mx-1" />
          {SIZE_BUTTONS.map((btn) => (
            <Button
              variant={activeSize === btn.var ? "secondary" : "transparent"}
              size="icon-sm"
              key={btn.var}
              onClick={(e) => {
                e.preventDefault();
                handleSizeFormat(btn.var, setActiveSize);
              }}
              title={`Tamanho: ${btn.tag}`}
            >
              <Icon Icon={btn.icon} size={btn.size} strokeWidth="thin" />
            </Button>
          ))}
        </>
      )}
    </div>
  );
}
