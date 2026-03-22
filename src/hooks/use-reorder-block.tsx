import { useCallback } from "react";
import { Block, Document } from "@/types/document";

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
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: reorderBlocksInTree(block.children, sourceId, targetId),
      };
    }
    return block;
  });
};

interface UseReorderBlockProps {
  selectedBlock: string;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  setIsReordering: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useReorderBlock = ({
  selectedBlock,
  setDoc,
  setIsReordering,
}: UseReorderBlockProps) => {
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

  return { handleReorder };
};
