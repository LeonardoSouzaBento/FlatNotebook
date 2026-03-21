import {
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
} from "@/components/doc-page";
import { BlockActions } from "@/components/doc-page/doc-block/index";
import { useDocPageContext } from "@/contexts";
import { Block, BlockImage as BlockImageType } from "@/types/document";
import {
  deleteBlockFromTree,
  findBlockInTree,
  updateBlockInTree,
} from "@/utils/block-utils";
import type { ChangeEvent, FocusEvent } from "react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

const MAX_DEPTH = 6;

const DocPage = () => {
  const { id } = useParams();
  const { documents, doc, setDoc } = useDocPageContext();
  const [readOnly, setReadOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("cap1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBlockObj = useMemo(() => {
    if (!doc || !selectedBlock) return null;
    return findBlockInTree(doc.blocks, selectedBlock);
  }, [doc, selectedBlock]);

  useEffect(() => {
    if (!id) return;
    const foundDoc = documents.find((d) => String(d.id) === id);
    if (foundDoc) {
      setDoc(foundDoc);
    } else {
      setDoc(null);
    }
  }, [id, documents, setDoc]);

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

  const handleBlockUpdate = useCallback(
    (updatedBlock: Block) => {
      setDoc((d) => {
        if (!d) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          blocks: updateBlockInTree(d.blocks, updatedBlock),
        };
      });
    },
    [setDoc],
  );

  const handleBlockDelete = useCallback(
    (blockId: string) => {
      setDoc((d) => {
        if (!d) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          blocks: deleteBlockFromTree(d.blocks, blockId),
        };
      });
    },
    [setDoc],
  );

  const addChapter = useCallback(() => {
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      level: 3,
      title: "Novo capítulo",
      content: "",
      collapsed: false,
      children: [],
    };
    setDoc((d) => {
      if (!d) return d;
      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: [...d.blocks, newBlock],
      };
    });
  }, [setDoc]);

  // Handlers for selected block toolbar in footer

  const handleSelectedBlockImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const block = findBlockInTree(doc?.blocks || [], selectedBlock);
      if (!block) return;
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const newImage: BlockImageType = {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          src,
          alt: file.name,
          edits: {},
        };
        handleBlockUpdate({
          ...block,
          images: [...(block.images || []), newImage],
        });
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [doc, selectedBlock, handleBlockUpdate],
  );

  const handleSelectedBlockAddChild = useCallback(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return;
    const childLevel = block.level + 1;
    if (childLevel > MAX_DEPTH) return;
    const newChild: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      level: childLevel,
      title: "Novo bloco",
      content: "",
      collapsed: false,
      children: [],
    };
    handleBlockUpdate({
      ...block,
      children: [...block.children, newChild],
    });
  }, [doc, selectedBlock, handleBlockUpdate]);

  const canAddChildren = useMemo(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return false;
    return block.level < MAX_DEPTH;
  }, [doc, selectedBlock]);

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
          {doc.blocks.map((block) => {
            return (
              <DocBlock
                key={block.id}
                block={block}
                onUpdate={handleBlockUpdate}
                onDelete={handleBlockDelete}
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
            />
          ) : (
            <span className="text-muted-foreground text-sm">
              Selecione um bloco para editar
            </span>
          )}
        </footer>
      )}
    </div>
  );
};

export default DocPage;
