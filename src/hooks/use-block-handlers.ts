import { useCallback, ChangeEvent, FocusEvent } from "react";
import { Block, BlockImage as BlockImageType } from "@/types/document";

interface UseBlockHandlersProps {
  block: Block;
  onUpdate: (block: Block) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const useBlockHandlers = ({
  block,
  onUpdate,
  fileInputRef,
}: UseBlockHandlersProps) => {
  const toggleCollapse = useCallback(() => {
    onUpdate({ ...block, collapsed: !block.collapsed });
  }, [block, onUpdate]);

  const handleTitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (newTitle !== block.title) {
        onUpdate({ ...block, title: newTitle });
      }
    },
    [block, onUpdate],
  );

  const handleContentChange = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      const newContent = e.currentTarget.textContent || "";
      if (newContent !== block.content) {
        onUpdate({ ...block, content: newContent });
      }
    },
    [block, onUpdate],
  );

  const handleChildUpdate = useCallback(
    (updatedChild: Block) => {
      const newChildren = block.children.map((c) =>
        c.id === updatedChild.id ? updatedChild : c,
      );
      onUpdate({ ...block, children: newChildren });
    },
    [block, onUpdate],
  );

  const handleChildDelete = useCallback(
    (childId: string) => {
      const newChildren = block.children.filter((c) => c.id !== childId);
      onUpdate({ ...block, children: newChildren });
    },
    [block, onUpdate],
  );

  const handleImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
        onUpdate({
          ...block,
          images: [...(block.images || []), newImage],
        });
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [block, onUpdate],
  );

  const handleImageUpdate = useCallback(
    (updatedImage: BlockImageType) => {
      const newImages = (block.images || []).map((img) =>
        img.id === updatedImage.id ? updatedImage : img,
      );
      onUpdate({ ...block, images: newImages });
    },
    [block, onUpdate],
  );

  const handleImageDelete = useCallback(
    (imageId: string) => {
      const newImages = (block.images || []).filter(
        (img) => img.id !== imageId,
      );
      onUpdate({ ...block, images: newImages });
    },
    [block, onUpdate],
  );

  return {
    toggleCollapse,
    handleTitleChange,
    handleContentChange,
    handleChildUpdate,
    handleChildDelete,
    handleImageAdd,
    handleFileChange,
    handleImageUpdate,
    handleImageDelete,
  };
};
