import { Block } from "@/types/document";

export const getAllBlockIds = (blocks: Block[]): string[] => {
  const ids: string[] = [];
  
  // Sort by order before traversing
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  for (const block of sortedBlocks) {
    ids.push(block.id);
    if (block.children && block.children.length > 0) {
      ids.push(...getAllBlockIds(block.children));
    }
  }
  
  return ids;
};
