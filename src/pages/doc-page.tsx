import {
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
  FormatToolbar,
} from "@/components/doc-page";
import { BlockActions } from "@/components/doc-page/doc-block/index";
import { AddDocModal } from "@/components/home";
import { useDocPageContext } from "@/contexts";
import {
  useDeleteBlock,
  useAddEquivalentBlock,
  useReorderBlock,
  useUpdateBlock,
} from "@/hooks";
import { Document as Doc } from "@/types/document";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllBlockIds } from "@/hooks/utils/tree-utils";
import NotFound from "./not-found";

const MAX_DEPTH = 6;

const DocPage = () => {
  const { id } = useParams();
  const { documents } = useDocPageContext();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [images, setImages] = useState<ImageEdit[]>([]);
  // deletar
  const { handleBlockDelete } = useDeleteBlock({ setDoc });
  const [scrollToView, setScrollToView] = useState(false);

  const handleOpenRename = useCallback(() => {
    if (!doc) return;
    setNewTitle(doc.title);
    setNewSubtitle(doc.subtitle || "");
    setRenameModalOpen(true);
  }, [doc]);

  const handleUpdateMetadata = useCallback(() => {
    if (!doc || !newTitle.trim()) return;
    setDoc({
      ...doc,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    setRenameModalOpen(false);
  }, [doc, newTitle, newSubtitle, setDoc]);

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
    addEquivalentBlock,
    addChildBlock,
    canAddChildren,
  } = useAddEquivalentBlock({
    doc,
    setDoc,
    selectedBlock,
    setSelectedBlock,
    MAX_DEPTH,
    setScrollToView,
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

  const handleSelectedBlockImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // rolar para o bloco selecionado
  useEffect(() => {
    if (!selectedBlock || !scrollToView) return;
    // Defer execution to ensure the block is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById(`block-${selectedBlock}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const footerHeight = 56; // h-14 = 56px
        const isVisible =
          rect.top >= 0 && rect.bottom <= window.innerHeight - footerHeight;

        if (!isVisible) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      setScrollToView(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedBlock, scrollToView]);

  if (!id || !doc) {
    return <NotFound />;
  }

  return (
    <div>
      <PageHeader readOnly={readOnly} setReadOnly={setReadOnly} />
      <main className="max-w-3xl min-h-dvh mx-auto px-4 sm:px-6 mb-8">
        <DocHeader
          doc={doc}
          setDoc={setDoc}
          readOnly={readOnly}
          onRename={handleOpenRename}
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
              doc={doc}
              readOnly={readOnly}
              onDelete={onBlockDelete}
              handleImageAdd={handleSelectedBlockImageAdd}
              canAddChildren={canAddChildren}
              addChildBlock={addChildBlock}
              onAddEquivalentBlock={addEquivalentBlock}
              onUpdateOrder={handleUpdateOrder}
            />
          ) : (
            <span className="text-sm size-full pb-px flex items-center justify-center">
              Clique em um bloco para editar
            </span>
          )}
        </footer>
      )}

      <AddDocModal
        open={renameModalOpen}
        onOpenChange={setRenameModalOpen}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newSubtitle={newSubtitle}
        setNewSubtitle={setNewSubtitle}
        onSubmit={handleUpdateMetadata}
        isRename={true}
      />
      <FormatToolbar />
    </div>
  );
};

export default DocPage;
