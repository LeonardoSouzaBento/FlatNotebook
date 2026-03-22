import { useCallback, useMemo } from "react";
import { Block, Document } from "@/types/document";
import { findBlockInTree } from "./utils/findBlockInTree";

export const findSiblings = (blocks: Block[], id: string): Block[] | null => {
  if (blocks.some((b) => b.id === id)) return blocks;
  for (const block of blocks) {
    if (block.children && block.children.length > 0) {
      const found = findSiblings(block.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const generateNextId = (id: string): string => {
  return id.replace(/(\d+)$/, (match) => String(parseInt(match, 10) + 1));
};

export const generateFirstChildId = (parent: Block): string => {
  const childLevel = parent.level + 1;
  const numbers = parent.id.match(/\d+/g) || ["0"];
  const prefix =
    childLevel === 4 ? "sec" : childLevel >= 5 ? "subsec" : "block";
  return `${prefix}${numbers.join("_")}_1`;
};

export const getDefaultTitle = (level: number): string => {
  if (level === 3) return "Novo capitulo";
  if (level === 4) return "Novo tópico";
  if (level >= 5) return "Novo subtopico";
  return "Novo bloco";
};

export const addSiblingBlockInTree = (
  blocks: Block[],
  afterId: string,
  newBlock: Block,
): Block[] => {
  const index = blocks.findIndex((b) => b.id === afterId);
  if (index !== -1) {
    const newBlocks = [...blocks];
    newBlocks.push(newBlock);
    return newBlocks;
  }

  return blocks.map((block) => {
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: addSiblingBlockInTree(block.children, afterId, newBlock),
      };
    }
    return block;
  });
};

const blocksWithNewChild = (
  blocks: Block[],
  parentId: string,
  newChild: Block,
): Block[] => {
  return blocks.map((block) => {
    if (block.id === parentId) {
      return {
        ...block,
        children: [...block.children, newChild],
      };
    }
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: blocksWithNewChild(block.children, parentId, newChild),
      };
    }
    return block;
  });
};

interface UseDuplicateBlockProps {
  doc: Document | null;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  selectedBlock: string;
  setDraftDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  MAX_DEPTH: number;
}

export const useDuplicateBlock = ({
  doc,
  setDoc,
  selectedBlock,
  setDraftDoc,
  MAX_DEPTH,
}: UseDuplicateBlockProps) => {
  const selectedBlockObj = useMemo(() => {
    if (!doc || !selectedBlock) return null;
    return findBlockInTree(doc.blocks, selectedBlock);
  }, [doc, selectedBlock]);

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
        blocks: addSiblingBlockInTree(
          targetDoc.blocks,
          selectedBlockObj.id,
          newBlock,
        ),
      };

      console.log("Draft Doc Update (Duplication):", updatedDoc);
      return updatedDoc;
    });
  }, [selectedBlockObj, doc, setDraftDoc]);

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

    setDoc((d) => {
      if (!d) return d;
      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: blocksWithNewChild(d.blocks, selectedBlock, newChild),
      };
    });
  }, [doc, selectedBlock, setDoc, MAX_DEPTH]);

  const canAddChildren = useMemo(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return false;
    return block.level < MAX_DEPTH;
  }, [doc, selectedBlock, MAX_DEPTH]);

  return {
    selectedBlockObj,
    handleDuplicateBlock,
    handleSelectedBlockAddChild,
    canAddChildren,
  };
};
