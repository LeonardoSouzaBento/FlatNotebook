import {
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
} from "@/components/doc-page";
import { BlockActions } from "@/components/doc-page/doc-block/index";
import { useDocPageContext } from "@/contexts";
import { Block, BlockImage as BlockImageType, Document } from "@/types/document";
import {
  deleteBlockFromTree,
  findBlockInTree,
  updateBlockInTree,
  reorderBlocksInTree,
  addSiblingBlockInTree,
  findSiblings,
  generateNextId,
  generateFirstChildId,
  getDefaultTitle,
} from "@/utils/block-utils";
import type { ChangeEvent, FocusEvent } from "react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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

  const selectedBlockObj = useMemo(() => {
    if (!doc || !selectedBlock) return null;
    return findBlockInTree(doc.blocks, selectedBlock);
  }, [doc, selectedBlock]);

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

  const handleReorder = useCallback(
    (targetId: string) => {
      if (!selectedBlock) return;
      setDoc((d) => {
        if (!d) return d;
        setIsReordering(false);
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          blocks: reorderBlocksInTree(d.blocks, selectedBlock, targetId),
        };
      });
    },
    [selectedBlock, setDoc],
  );

  const handleDuplicateBlock = useCallback(() => {
    if (!selectedBlockObj) return;

    const siblings = findSiblings(doc?.blocks || [], selectedBlockObj.id) || [];
    const lastSibling = siblings[siblings.length - 1];
    const newId = generateNextId(lastSibling.id);

    const newBlock: Block = {
      id: newId,
      level: selectedBlockObj.level,
      title: getDefaultTitle(selectedBlockObj.level),
      content: "",
      collapsed: false,
      children: [],
    };

    setDraftDoc((d) => {
      const targetDoc = d || doc;
      if (!targetDoc) return null;
      
      const updatedDoc = {
        ...targetDoc,
        updatedAt: new Date().toISOString(),
        blocks: addSiblingBlockInTree(targetDoc.blocks, selectedBlockObj.id, newBlock),
      };
      
      console.log("Draft Doc Update (Duplication):", updatedDoc);
      return updatedDoc;
    });

    // setSelectedBlock(newBlock.id);

    // Scroll to the new block after selection
    /*
    setTimeout(() => {
      const element = document.getElementById(`block-${newBlock.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    */
  }, [selectedBlockObj, doc]);

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

    let newId: string;
    if (block.children && block.children.length > 0) {
      newId = generateNextId(block.children[block.children.length - 1].id);
    } else {
      newId = generateFirstChildId(block);
    }

    const newChild: Block = {
      id: newId,
      level: childLevel,
      title: getDefaultTitle(childLevel),
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
          {doc.blocks
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((block) => {
              return (
                <DocBlock
                  key={block.id}
                  block={block}
                  onUpdate={handleBlockUpdate}
                  onDelete={handleBlockDelete}
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
