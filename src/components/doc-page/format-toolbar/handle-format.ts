import { FormatType } from "./types";

export const handleFormat = (
  format: FormatType,
  checkFormat: (type: FormatType) => boolean,
  setActiveFormats: (formats: Record<FormatType, boolean>) => void
) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const container = selection.anchorNode?.parentElement?.closest(
    '[contenteditable="true"]',
  );

  let currentNode: Node | null = selection.anchorNode;
  let formatNode: HTMLElement | null = null;
  let otherFormatNode: HTMLElement | null = null;

  if (format === "upper" || format === "capitalize") {
    const className = format === "upper" ? "uppercase" : "capitalize";
    const otherClassName = format === "upper" ? "capitalize" : "uppercase";

    while (currentNode && currentNode !== container) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const el = currentNode as HTMLElement;
        if (!formatNode && el.classList.contains(className)) {
          formatNode = el;
        }
        if (!otherFormatNode && el.classList.contains(otherClassName)) {
          otherFormatNode = el;
        }
        if (formatNode && otherFormatNode) break;
      }
      currentNode = currentNode.parentNode;
    }

    const isActive = checkFormat(format);

    if (isActive) {
      // Toggle OFF: If we're inside a node with the current class, remove it
      if (formatNode) {
        const parent = formatNode.parentNode;
        if (parent) {
          const firstChild = formatNode.firstChild;
          const lastChild = formatNode.lastChild;
          while (formatNode.firstChild) {
            parent.insertBefore(formatNode.firstChild, formatNode);
          }
          parent.removeChild(formatNode);
          if (firstChild && lastChild) {
            const newRange = document.createRange();
            newRange.setStartBefore(firstChild);
            newRange.setEndAfter(lastChild);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      } else {
        // Otherwise, extract contents and remove any inner tags with the class
        const frag = range.extractContents();
        const temp = document.createElement("div");
        temp.appendChild(frag);
        const tags = temp.querySelectorAll(`span.${className}`);
        tags.forEach((tag) => {
          const parent = tag.parentNode;
          if (parent) {
            while (tag.firstChild) parent.insertBefore(tag.firstChild, tag);
            parent.removeChild(tag);
          }
        });
        const afterExtract = document.createDocumentFragment();
        while (temp.firstChild) afterExtract.appendChild(temp.firstChild);
        const children = Array.from(afterExtract.childNodes);
        range.insertNode(afterExtract);
        if (children.length > 0) {
          const newRange = document.createRange();
          newRange.setStartBefore(children[0]);
          newRange.setEndAfter(children[children.length - 1]);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } else {
      // Toggle ON: If we're inside a node with the OTHER class, swap it
      if (otherFormatNode) {
        otherFormatNode.classList.remove(otherClassName);
        otherFormatNode.classList.add(className);
        const newRange = document.createRange();
        newRange.selectNodeContents(otherFormatNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // Otherwise, extract, remove any inner "other" tags, and wrap everything
        const frag = range.extractContents();
        const temp = document.createElement("div");
        temp.appendChild(frag);
        
        // Remove ANY occurrence of the other class first
        const otherTags = temp.querySelectorAll(`span.${otherClassName}`);
        otherTags.forEach((tag) => {
          const parent = tag.parentNode;
          if (parent) {
            while (tag.firstChild) parent.insertBefore(tag.firstChild, tag);
            parent.removeChild(tag);
          }
        });

        const wrapper = document.createElement("span");
        wrapper.className = className;
        while (temp.firstChild) wrapper.appendChild(temp.firstChild);
        range.insertNode(wrapper);
        const newRange = document.createRange();
        newRange.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  } else {
    const targetTag1 =
      format === "bold" ? "STRONG" : format === "italic" ? "EM" : "U";
    const targetTag2 =
      format === "bold" ? "B" : format === "italic" ? "I" : "U";

    while (currentNode && currentNode !== container) {
      if (
        currentNode.nodeName === targetTag1 ||
        currentNode.nodeName === targetTag2
      ) {
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
          const firstChild = formatNode.firstChild;
          const lastChild = formatNode.lastChild;
          while (formatNode.firstChild) {
            parent.insertBefore(formatNode.firstChild, formatNode);
          }
          parent.removeChild(formatNode);
          if (firstChild && lastChild) {
            const newRange = document.createRange();
            newRange.setStartBefore(firstChild);
            newRange.setEndAfter(lastChild);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
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
        const children = Array.from(afterExtract.childNodes);
        range.insertNode(afterExtract);
        if (children.length > 0) {
          const newRange = document.createRange();
          newRange.setStartBefore(children[0]);
          newRange.setEndAfter(children[children.length - 1]);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } else {
      const wrapper = document.createElement(
        format === "bold" ? "strong" : format === "italic" ? "em" : "u",
      );
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  setActiveFormats({
    capitalize: checkFormat("capitalize"),
    upper: checkFormat("upper"),
    bold: checkFormat("bold"),
    italic: checkFormat("italic"),
    underline: checkFormat("underline"),
  });

  if (container) {
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
