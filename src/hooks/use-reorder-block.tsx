import { useCallback } from "react";
import { Block, Document } from "@/types/document";

/**
 * Recursively find the siblings and parent id of a block in the tree.
 * Siblings can be top-level blocks or children of an existing block.
 * returns { parentId: string | null, siblings: Block[] }
 */
export const findSiblingsInfo = (
  blocks: Block[],
  targetId: string,
  parentId: string | null = null,
): { parentId: string | null; siblings: Block[] } | null => {
  const isAtThisLevel = blocks.some((b) => b.id === targetId);
  if (isAtThisLevel) {
    return { parentId, siblings: blocks };
  }

  for (const block of blocks) {
    if (block.children && block.children.length > 0) {
      const found = findSiblingsInfo(block.children, targetId, block.id);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Recursively updates a list of blocks at a specific level (siblings of targetId)
 * with the new ordered version.
 */
export const updateBlocksOrderInTree = (
  blocks: Block[],
  targetId: string,
  newOrderedSiblings: Block[],
): Block[] => {
  // Check if they are in the current list
  const isAtThisLevel = blocks.some((b) => b.id === targetId);

  if (isAtThisLevel) {
    // Current blocks should be replaced by newOrderedSiblings,
    // and updated with their new order indices
    return newOrderedSiblings.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  // Otherwise, recurse into children
  return blocks.map((block) => {
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: updateBlocksOrderInTree(
          block.children,
          targetId,
          newOrderedSiblings,
        ),
      };
    }
    return block;
  });
};

interface UseReorderBlockProps {
  selectedBlock: string;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
}

export const useReorderBlock = ({
  selectedBlock,
  setDoc,
}: UseReorderBlockProps) => {
  const handleUpdateOrder = useCallback(
    (newOrderedSiblings: Block[]) => {
      if (!selectedBlock) return;
      setDoc((d) => {
        if (!d) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          blocks: updateBlocksOrderInTree(
            d.blocks,
            selectedBlock,
            newOrderedSiblings,
          ),
        };
      });
    },
    [selectedBlock, setDoc],
  );

  return { handleUpdateOrder };
};
