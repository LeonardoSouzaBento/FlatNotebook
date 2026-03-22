import { Block } from "@/types/document";

export const findBlockInTree = (blocks: Block[], id: string): Block | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children.length > 0) {
      const found = findBlockInTree(block.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateBlockInTree = (
  blocks: Block[],
  updatedBlock: Block,
): Block[] => {
  return blocks.map((block) => {
    if (block.id === updatedBlock.id) return updatedBlock;
    if (block.children.length > 0) {
      return {
        ...block,
        children: updateBlockInTree(block.children, updatedBlock),
      };
    }
    return block;
  });
};

export const deleteBlockFromTree = (blocks: Block[], id: string): Block[] => {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => {
      if (block.children.length > 0) {
        return {
          ...block,
          children: deleteBlockFromTree(block.children, id),
        };
      }
      return block;
    });
};

export const reorderBlocksInTree = (
  blocks: Block[],
  sourceId: string,
  targetId: string,
): Block[] => {
  // Check if they are in the current list
  const sourceIdx = blocks.findIndex((b) => b.id === sourceId);
  const targetIdx = blocks.findIndex((b) => b.id === targetId);

  if (sourceIdx !== -1 && targetIdx !== -1) {
    const newBlocks = [...blocks];
    // Swap positions
    [newBlocks[sourceIdx], newBlocks[targetIdx]] = [
      newBlocks[targetIdx],
      newBlocks[sourceIdx],
    ];

    // Assign order values based on new indices to persist the change
    return newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  // Otherwise, recurse into children
  return blocks.map((block) => {
    if (block.children.length > 0) {
      return {
        ...block,
        children: reorderBlocksInTree(block.children, sourceId, targetId),
      };
    }
    return block;
  });
};

export const generateNextId = (id: string): string => {
  return id.replace(/(\d+)$/, (match) => String(parseInt(match, 10) + 1));
};

export const generateFirstChildId = (parent: Block): string => {
  const childLevel = parent.level + 1;
  const numbers = parent.id.match(/\d+/g) || ["0"];
  const prefix = childLevel === 4 ? "sec" : childLevel >= 5 ? "subsec" : "block";
  return `${prefix}${numbers.join("_")}_1`;
};

export const getDefaultTitle = (level: number): string => {
  if (level === 3) return "Novo capitulo";
  if (level === 4) return "Novo tópico";
  if (level >= 5) return "Novo subtopico";
  return "Novo bloco";
};

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
