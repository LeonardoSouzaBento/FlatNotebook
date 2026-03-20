import { Block, BlockImage as BlockImageType } from "@/types/document";
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AddChildBlockBtn,
  BlockHeader,
  BlockImageItem,
} from "./doc-block/index";

interface DocBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: (blockId: string) => void;
  readOnly?: boolean;
}

const classesByLevel = {
  3: "border border-border/75 mb-6 pt-2 px-1.75 rounded-lg",
  4: "mb-2 last:mb-0 pt-2 pb-0.5 rounded-md",
  5: "mb-4",
  6: "mb-1",
};

const MAX_DEPTH = 6;

export const DocBlock: React.FC<DocBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  readOnly = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCollapse = useCallback(() => {
    onUpdate({ ...block, collapsed: !block.collapsed });
  }, [block, onUpdate]);

  const handleTitleChange = useCallback(
    (e: FocusEvent<HTMLElement>) => {
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

  const addChildBlock = useCallback(() => {
    const childLevel = block.level + 1;
    if (childLevel > MAX_DEPTH) return;
    const newChild: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      level: childLevel,
      title: "Novo bloco",
      content: "",
      collapsed: false,
      children: [],
    };
    onUpdate({ ...block, children: [...block.children, newChild] });
  }, [block, onUpdate]);

  const handleImageAdd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  const canAddChildren = block.level < MAX_DEPTH;

  return (
    <div
      id={`block-${block.id}`}
      className={`relative ${classesByLevel[block.level]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BlockHeader
        block={block}
        readOnly={readOnly}
        handleTitleChange={handleTitleChange}
        toggleCollapse={toggleCollapse}
        handleImageAdd={handleImageAdd}
        onDelete={onDelete}
        isHovered={isHovered}
        canAddChildren={canAddChildren}
        addChildBlock={addChildBlock}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!block.collapsed && (
        <div>
          <p
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={handleContentChange}
            onClick={readOnly ? toggleCollapse : undefined}
            className={`px-9 pb-4 rounded text-foreground/85 min-h-[1.5em] font-sans empty:before:content-['Escreva_aqui...'] empty:before:text-muted-foreground/50 ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
          >
            {block.content}
          </p>

          {(block.images || []).map((image) => (
            <BlockImageItem
              key={image.id}
              image={image}
              onUpdate={handleImageUpdate}
              onDelete={handleImageDelete}
            />
          ))}

          {block.children.map((child) => (
            <DocBlock
              key={child.id}
              block={child}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};
