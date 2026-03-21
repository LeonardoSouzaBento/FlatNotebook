import { Document } from "@/types/document";
import type { FocusEvent } from "react";

interface Props {
  doc: Document;
  readOnly: boolean;
  handleTitleChange: (e: FocusEvent<HTMLHeadingElement>) => void;
  handleSubtitleChange: (e: FocusEvent<HTMLHeadingElement>) => void;
}

export const DocHeader = ({
  doc,
  readOnly,
  handleTitleChange,
  handleSubtitleChange,
}: Props) => {
  return (
    <>
      <h1
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onBlur={handleTitleChange}
        className={`px-1 rounded mb-2.25 ${readOnly ? "pointer-events-none" : "cursor-text"}`}
      >
        {doc.title}
      </h1>

      <h2
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onBlur={handleSubtitleChange}
        className={`px-1 rounded mb-8 text-muted-foreground ${readOnly ? "pointer-events-none" : "cursor-text"}`}
      >
        {doc.subtitle || ""}
      </h2>
    </>
  );
};
