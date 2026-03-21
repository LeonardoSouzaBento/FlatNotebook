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
