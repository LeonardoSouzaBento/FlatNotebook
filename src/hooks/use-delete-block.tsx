import { useCallback } from "react";
import { Block, Document } from "@/types/document";

const deleteBlockFromTree = (blocks: Block[], id: string): Block[] => {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => {
      if (block.children && block.children.length > 0) {
        return {
          ...block,
          children: deleteBlockFromTree(block.children, id),
        };
      }
      return block;
    });
};

interface UseDeleteBlockProps {
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
}

export const useDeleteBlock = ({ setDoc }: UseDeleteBlockProps) => {
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

  return { handleBlockDelete };
};
