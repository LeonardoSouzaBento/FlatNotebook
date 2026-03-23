import {
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
} from "@/components/doc-page";
import { BlockActions } from "@/components/doc-page/doc-block/index";
import { useDocPageContext } from "@/contexts";
import { useDeleteBlock } from "@/hooks/use-delete-block";
import { useDuplicateBlock } from "@/hooks/use-duplicate-block";
import { useReorderBlock } from "@/hooks/use-reorder-block";
import { useUpdateBlock } from "@/hooks/use-update-block";
import { Document } from "@/types/document";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllBlockIds } from "@/hooks/utils/tree-utils";

const MAX_DEPTH = 6;

const DocPage = () => {
  const { id } = useParams();
  const { documents, doc, setDoc } = useDocPageContext();
  const [readOnly, setReadOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [draftDoc, setDraftDoc] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // deletar
  const { handleBlockDelete } = useDeleteBlock({ setDoc });

  const onBlockDelete = useCallback(
    (blockId: string) => {
      if (!doc) return;

      const allIds = getAllBlockIds(doc.blocks);
      const index = allIds.indexOf(blockId);

      let nextSelectedId = "";
      if (index !== -1) {
        if (index < allIds.length - 1) {
          nextSelectedId = allIds[index + 1];
        } else if (index > 0) {
          nextSelectedId = allIds[index - 1];
        }
      }

      handleBlockDelete(blockId);
      if (nextSelectedId) {
        setSelectedBlock(nextSelectedId);
      }
    },
    [doc, handleBlockDelete, setSelectedBlock],
  );

  // reordenar
  const { handleUpdateOrder } = useReorderBlock({
    selectedBlock,
    setDoc,
  });
  // atualizar
  const { handleBlockUpdate, handleFileChange } = useUpdateBlock({
    doc,
    setDoc,
    selectedBlock,
  });
  // duplicar
  const {
    selectedBlockObj,
    handleDuplicateBlock,
    handleSelectedBlockAddChild,
    canAddChildren,
  } = useDuplicateBlock({
    doc,
    setDoc,
    selectedBlock,
    setSelectedBlock,
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
  }, [id, documents, setDoc]); // não coloque selectedBlock aqui!!!

  useEffect(() => {
    if (draftDoc) {
      console.log("Draft Doc State:", draftDoc);
    }
  }, [draftDoc]);

  const handleSelectedBlockImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    if (!selectedBlock) return;
    
    // Defer execution to ensure the block is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById(`block-${selectedBlock}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const footerHeight = 56; // h-14 = 56px
        const isVisible = (
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight - footerHeight)
        );

        if (!isVisible) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedBlock]);

  if (!id || !doc) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      <PageHeader readOnly={readOnly} setReadOnly={setReadOnly} />
      <main className="max-w-3xl min-h-dvh mx-auto px-4 sm:px-6 mb-8">
        <DocHeader doc={doc} setDoc={setDoc} readOnly={readOnly} />

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
          className="w-full h-14 bg-medium-bg/80 backdrop-blur-xs px-4
        border-t border-border/50 sticky bottom-0 left-0 z-50 shadow-sm/1"
        >
          {selectedBlockObj ? (
            <BlockActions
              block={selectedBlockObj}
              readOnly={readOnly}
              onDelete={onBlockDelete}
              handleImageAdd={handleSelectedBlockImageAdd}
              canAddChildren={canAddChildren}
              addChildBlock={handleSelectedBlockAddChild}
              onDuplicate={handleDuplicateBlock}
              onUpdateOrder={handleUpdateOrder}
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
