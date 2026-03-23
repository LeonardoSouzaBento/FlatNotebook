import { Document } from "@/types/document";
import { StateSetter } from "@/types/react";
import { useCallback, type FocusEvent } from "react";

interface Props {
  doc: Document;
  setDoc: StateSetter<Document | null>;
  readOnly: boolean;
}

export const DocHeader = ({ doc, readOnly, setDoc }: Props) => {
  const handleTitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (doc && newTitle !== doc.title) {
        setDoc((d) => {
          if (!d) return d;
          return {
            ...d,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
        });
      }
    },
    [doc, setDoc],
  );

  const handleSubtitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
      const newSub = e.currentTarget.textContent || "";
      if (doc && newSub !== doc.subtitle) {
        setDoc((d) => {
          if (!d) return d;
          return {
            ...d,
            subtitle: newSub,
            updatedAt: new Date().toISOString(),
          };
        });
      }
    },
    [doc, setDoc],
  );
  
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
      {doc.subtitle && (
        <h2
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleSubtitleChange}
          className={`px-1 rounded mb-8 text-muted-foreground ${readOnly ? "pointer-events-none" : "cursor-text"}`}
        >
          {doc.subtitle || ""}
        </h2>
      )}
    </>
  );
};
