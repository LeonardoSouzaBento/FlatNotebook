import { useEffect, useState, useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { Button } from "@/ui";

type FormatType = "bold" | "italic" | "underline";

const FORMAT_BUTTONS: {
  type: FormatType;
  icon: React.ElementType;
  title: string;
}[] = [
  { type: "bold", icon: Bold, title: "Negrito" },
  { type: "italic", icon: Italic, title: "Itálico" },
  { type: "underline", icon: Underline, title: "Sublinhado" },
];

const checkFormat = (type: FormatType): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  
  let node: Node | null = selection.anchorNode;
  const targetTag1 = type === "bold" ? "STRONG" : type === "italic" ? "EM" : "U";
  const targetTag2 = type === "bold" ? "B" : type === "italic" ? "I" : "U";

  while (node && node.nodeName !== "DIV" && node.nodeName !== "P") {
    if (node.nodeName === targetTag1 || node.nodeName === targetTag2) return true;
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
  const [activeFormats, setActiveFormats] = useState<Record<FormatType, boolean>>({
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
      if (!node || !node.parentElement?.closest('[contenteditable="true"]')) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2 - 60,
      });
      setActiveFormats({
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

  const handleFormat = (format: FormatType) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = selection.anchorNode?.parentElement?.closest(
      '[contenteditable="true"]',
    );

    let currentNode: Node | null = selection.anchorNode;
    let formatNode: HTMLElement | null = null;
    const targetTag1 = format === "bold" ? "STRONG" : format === "italic" ? "EM" : "U";
    const targetTag2 = format === "bold" ? "B" : format === "italic" ? "I" : "U";

    while (currentNode && currentNode !== container) {
      if (currentNode.nodeName === targetTag1 || currentNode.nodeName === targetTag2) {
        formatNode = currentNode as HTMLElement;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    const isActive = checkFormat(format);

    if (isActive) {
      if (formatNode) {
        const parent = formatNode.parentNode;
        if (parent) {
          while (formatNode.firstChild) {
            parent.insertBefore(formatNode.firstChild, formatNode);
          }
          parent.removeChild(formatNode);
        }
      } else {
        const frag = range.extractContents();
        const temp = document.createElement("div");
        temp.appendChild(frag);
        const tags = temp.querySelectorAll(
          `${targetTag1.toLowerCase()}, ${targetTag2.toLowerCase()}`,
        );
        tags.forEach((tag) => {
          const parent = tag.parentNode;
          if (parent) {
            while (tag.firstChild) {
              parent.insertBefore(tag.firstChild, tag);
            }
            parent.removeChild(tag);
          }
        });
        const afterExtract = document.createDocumentFragment();
        while (temp.firstChild) {
          afterExtract.appendChild(temp.firstChild);
        }
        range.insertNode(afterExtract);
      }
    } else {
      const wrapper = document.createElement(
        format === "bold" ? "strong" : format === "italic" ? "em" : "u",
      );
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }

    setActiveFormats({
      bold: checkFormat("bold"),
      italic: checkFormat("italic"),
      underline: checkFormat("underline"),
    });

    if (container) {
      container.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-2 p-1 pb-1.25 bg-background border rounded-md shadow-md animate-in fade-in"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {FORMAT_BUTTONS.map(({ type, icon: Icon, title }) => (
        <Button
          variant={activeFormats[type] ? "secondary" : "transparent"}
          size="icon-sm"
          key={type}
          onClick={(e) => {
            e.preventDefault();
            handleFormat(type);
          }}
          title={title}
        >
          <Icon size={16} />
        </Button>
      ))}
    </div>
  );
}
