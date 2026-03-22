import {
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
} from "@/components/doc-page";
import { BlockActions } from "@/components/doc-page/doc-block/index";
import { useDocPageContext } from "@/contexts";
import { useDocBlocks } from "@/hooks/use-doc-blocks";
import { Document } from "@/types/document";
import type { FocusEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const MAX_DEPTH = 6;

const DocPage = () => {
  const { id } = useParams();
  const { documents, doc, setDoc } = useDocPageContext();
  const [readOnly, setReadOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [isReordering, setIsReordering] = useState(false);
  const [draftDoc, setDraftDoc] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedBlockObj,
    handleBlockUpdate,
    handleBlockDelete,
    handleReorder,
    handleDuplicateBlock,
    handleFileChange,
    handleSelectedBlockAddChild,
    canAddChildren,
  } = useDocBlocks({
    doc,
    setDoc,
    selectedBlock,
    setSelectedBlock,
    setIsReordering,
    setDraftDoc,
    MAX_DEPTH,
  });

  useEffect(() => {
    if (!id) return;
    const foundDoc = documents.find((d) => String(d.id) === id);
    if (foundDoc) {
      setDoc(foundDoc);
      // Select the first block if none is selected
      if (foundDoc.blocks.length > 0 && !selectedBlock) {
        setSelectedBlock(foundDoc.blocks[0].id);
      }
    } else {
      setDoc(null);
    }
  }, [id, documents, setDoc]);

  useEffect(() => {
    if (draftDoc) {
      console.log("Draft Doc State:", draftDoc);
    }
  }, [draftDoc]);

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

  const handleSelectedBlockImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!id || !doc) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-background">
      <PageHeader readOnly={readOnly} setReadOnly={setReadOnly} />
      <main className="max-w-3xl min-h-dvh mx-auto px-4 sm:px-6 mb-8">
        <DocHeader
          doc={doc}
          readOnly={readOnly}
          handleTitleChange={handleTitleChange}
          handleSubtitleChange={handleSubtitleChange}
        />

        <DocSummary blocks={doc.blocks} />

        <div>
          {doc.blocks
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((block) => {
              return (
                <DocBlock
                  key={block.id}
                  block={block}
                  onUpdate={handleBlockUpdate}
                  readOnly={readOnly}
                  selectedBlock={selectedBlock}
                  setSelectedBlock={setSelectedBlock}
                  isReordering={isReordering}
                  selectedBlockLevel={selectedBlockObj?.level}
                  onReorder={handleReorder}
                />
              );
            })}
        </div>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!readOnly && (
        <footer
          className="w-full h-14 bg-light-bg/75 backdrop-blur-xs px-4
        border-t border-border/50 sticky bottom-0 left-0 z-50 shadow-sm"
        >
          {selectedBlockObj ? (
            <BlockActions
              block={selectedBlockObj}
              readOnly={readOnly}
              onDelete={handleBlockDelete}
              handleImageAdd={handleSelectedBlockImageAdd}
              canAddChildren={canAddChildren}
              addChildBlock={handleSelectedBlockAddChild}
              isReordering={isReordering}
              setIsReordering={setIsReordering}
              onDuplicate={handleDuplicateBlock}
            />
          ) : (
            <span className="text-sm size-full pb-px flex items-center justify-center">
              Clique em um bloco para editar
            </span>
          )}
        </footer>
      )}
    </div>
  );
};

export default DocPage;
