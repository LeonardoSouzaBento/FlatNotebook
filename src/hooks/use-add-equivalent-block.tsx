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

/**
 * Generates a new ID based on the count of siblings at that level.
 * Following the user's request: "adicionar um numero sequencial no id que seja relacionado a quantidade de blocos daquele nivel adicionados"
 */
export const generateIdFromSiblingsCount = (level: number, siblings: Block[], parentId?: string): string => {
  const nextNumber = siblings.length + 1;
  
  if (level === 3) {
    return `cap${nextNumber}`;
  }

  // Find a sibling to get the prefix pattern (e.g. "sec3_" or "subsec3_1_")
  const sampleSibling = siblings[0];
  if (sampleSibling) {
    const lastUnderscoreIndex = sampleSibling.id.lastIndexOf("_");
    if (lastUnderscoreIndex !== -1) {
      const prefix = sampleSibling.id.substring(0, lastUnderscoreIndex + 1);
      return `${prefix}${nextNumber}`;
    }
  }

  // Fallback using parentId if no siblings exist yet
  // e.g. parent "cap3" -> children level 4 starts with "sec3_1"
  if (parentId) {
    const parentNumbers = parentId.match(/\d+/g) || ["0"];
    const prefix = level === 4 ? "sec" : level >= 5 ? "subsec" : "block";
    return `${prefix}${parentNumbers.join("_")}_${nextNumber}`;
  }

  return `block_${level}_${nextNumber}`;
};

export const getDefaultTitle = (level: number): string => {
  if (level === 3) return "Novo capítulo";
  if (level === 4) return "Novo tópico";
  if (level >= 5) return "Novo subtópico";
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
    // Insert after the current block
    newBlocks.splice(index + 1, 0, newBlock);
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
        collapsed: false,
        children: [...(block.children || []), newChild],
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

interface UseAddEquivalentBlockProps {
  doc: Document | null;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  selectedBlock: string;
  setSelectedBlock: (id: string) => void;
  MAX_DEPTH: number;
}

export const useAddEquivalentBlock = ({
  doc,
  setDoc,
  selectedBlock,
  setSelectedBlock,
  MAX_DEPTH,
}: UseAddEquivalentBlockProps) => {
  const selectedBlockObj = useMemo(() => {
    if (!doc || !selectedBlock) return null;
    return findBlockInTree(doc.blocks, selectedBlock);
  }, [doc, selectedBlock]);

  const addEquivalentBlock = useCallback(() => {
    if (!selectedBlockObj || !doc) return;

    const siblings = findSiblings(doc.blocks, selectedBlockObj.id) || [];
    // We increment based on current siblings count
    const newId = generateIdFromSiblingsCount(selectedBlockObj.level, siblings);

    const newBlock: Block = {
      id: newId,
      level: selectedBlockObj.level,
      title: getDefaultTitle(selectedBlockObj.level),
      content: [],
      collapsed: false,
      children: [],
    };

    setDoc((d) => {
      if (!d) return d;

      // Re-calculate ID inside setDoc to avoid race conditions if multiple clicks happen
      const currentBlock = findBlockInTree(d.blocks, selectedBlockObj.id);
      if (!currentBlock) return d;
      
      const currentSiblings = findSiblings(d.blocks, currentBlock.id) || [];
      const safeId = generateIdFromSiblingsCount(currentBlock.level, currentSiblings);
      
      const safeBlock = { ...newBlock, id: safeId };

      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: addSiblingBlockInTree(d.blocks, currentBlock.id, safeBlock),
      };
    });

    // Note: setSelectedBlock might still be a bit behind if we don't know the exact safeId here,
    // but usually it will match unless there's a heavy race.
    setSelectedBlock(newId);
  }, [selectedBlockObj, doc, setDoc, setSelectedBlock]);

  const addChildBlock = useCallback(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return;
    const childLevel = block.level + 1;
    if (childLevel > MAX_DEPTH) return;

    const newId = generateIdFromSiblingsCount(childLevel, block.children || [], block.id);

    const newChild: Block = {
      id: newId,
      level: childLevel,
      title: getDefaultTitle(childLevel),
      content: [],
      collapsed: false,
      children: [],
    };

    setDoc((d) => {
      if (!d) return d;
      
      const parentBlock = findBlockInTree(d.blocks, selectedBlock);
      if (!parentBlock) return d;
      
      const safeId = generateIdFromSiblingsCount(childLevel, parentBlock.children || [], parentBlock.id);
      const safeChild = { ...newChild, id: safeId };

      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: blocksWithNewChild(d.blocks, selectedBlock, safeChild),
      };
    });

    setSelectedBlock(newId);
  }, [doc, selectedBlock, setDoc, setSelectedBlock, MAX_DEPTH]);

  const canAddChildren = useMemo(() => {
    const block = findBlockInTree(doc?.blocks || [], selectedBlock);
    if (!block) return false;
    return block.level < MAX_DEPTH;
  }, [doc, selectedBlock, MAX_DEPTH]);

  return {
    selectedBlockObj,
    addEquivalentBlock,
    addChildBlock,
    canAddChildren,
  };
};
