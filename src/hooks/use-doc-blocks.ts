import { useCallback, useMemo, ChangeEvent } from "react";
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

interface UseDocBlocksProps {
  doc: Document | null;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  selectedBlock: string;
  setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
  setIsReordering: React.Dispatch<React.SetStateAction<boolean>>;
  setDraftDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  MAX_DEPTH: number;
}

export const useDocBlocks = ({
  doc,
  setDoc,
  selectedBlock,
  setSelectedBlock,
  setIsReordering,
  setDraftDoc,
  MAX_DEPTH,
}: UseDocBlocksProps) => {

  const selectedBlockObj = useMemo(() => {
    if (!doc || !selectedBlock) return null;
    return findBlockInTree(doc.blocks, selectedBlock);
  }, [doc, selectedBlock]);

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
    [selectedBlock, setDoc, setIsReordering],
  );

  const handleDuplicateBlock = useCallback(() => {
    if (!selectedBlockObj || !doc) return;

    const siblings = findSiblings(doc.blocks, selectedBlockObj.id) || [];
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
  }, [selectedBlockObj, doc, setDraftDoc]);

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
  }, [doc, selectedBlock, handleBlockUpdate, MAX_DEPTH]);

  const canAddChildren = useMemo(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return false;
    return block.level < MAX_DEPTH;
  }, [doc, selectedBlock, MAX_DEPTH]);

  return {
    selectedBlockObj,
    handleBlockUpdate,
    handleBlockDelete,
    handleReorder,
    handleDuplicateBlock,
    handleFileChange,
    handleSelectedBlockAddChild,
    canAddChildren,
  };
};
