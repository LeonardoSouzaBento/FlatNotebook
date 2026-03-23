import { Document } from "@/types/document";
import { StateSetter } from "@/types/react";
import { Button, Icon } from "@/ui";
import { Pencil } from "lucide-react";
import { useCallback, type FocusEvent } from "react";

interface Props {
  doc: Document;
  setDoc: StateSetter<Document | null>;
  readOnly: boolean;
  onRename: () => void;
}

export const DocHeader = ({ doc, readOnly, setDoc, onRename }: Props) => {
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
      <div className="relative flex justify-between gap-4">
        <h1
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className={`pl-px rounded mb-2.25
            ${readOnly ? "pointer-events-none" : "cursor-text"}
            ${!doc.subtitle ? "mb-4" : ""}`}
        >
          {doc.title}
        </h1>
        {!readOnly && (
          <Button
            size="icon"
            variant="secondary"
            className="rounded-xl shadow-xs/12 shrink-0 mt-1"
            onClick={onRename}
          >
            <Icon Icon={Pencil} size="md" />
          </Button>
        )}
      </div>
      {doc.subtitle && (
        <h2
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleSubtitleChange}
          className={`pl-px rounded mb-8 text-muted-foreground ${readOnly ? "pointer-events-none" : "cursor-text"}`}
        >
          {doc.subtitle || ""}
        </h2>
      )}
    </>
  );
};
