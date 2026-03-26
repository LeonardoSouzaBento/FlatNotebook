import { useCallback } from "react";
import {
  Block,
  BlockImage as BlockImageType,
  Document,
} from "@/types/document";
import { findBlockInTree } from "./utils/findBlockInTree";

const updateBlockInTree = (blocks: Block[], updatedBlock: Block): Block[] => {
  return blocks.map((block) => {
    if (block.id === updatedBlock.id) return updatedBlock;
    if (block.children && block.children.length > 0) {
      return {
        ...block,
        children: updateBlockInTree(block.children, updatedBlock),
      };
    }
    return block;
  });
};

interface UseUpdateBlockProps {
  doc: Document | null;
  setDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  selectedBlock: string;
}

const useUpdateBlock = ({
  doc,
  setDoc,
  selectedBlock,
}: UseUpdateBlockProps) => {
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
          edits: { resize: { widthPx: 220 } },
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

  return { handleBlockUpdate, handleFileChange };
};

export { useUpdateBlock, findBlockInTree, updateBlockInTree };
