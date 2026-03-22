import { Block, BlockImage as BlockImageType } from "@/types/document";
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { BlockHeader, BlockImageItem } from "./doc-block/index";
import { StateSetter } from "@/types/react";
import { Separator } from "@/ui";
// import { log } from "console";

interface DocBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: (blockId: string) => void;
  readOnly?: boolean;
  selectedBlock: string;
  setSelectedBlock: StateSetter<string>;
  isReordering?: boolean;
  selectedBlockLevel?: number;
  onReorder?: (targetId: string) => void;
}

const classesByLevel = {
  3: "pt-2 pb-1.25 mb-4 last:mb-0",
  4: "pt-2 pb-0.5 rounded-md",
  5: "pt-2.5 pb-0.75 mb-0 last:mb-0",
  6: "pt-2.25 pb-0.5",
};

// const MAX_DEPTH = 6;

export const DocBlock = ({
  block,
  onUpdate,
  onDelete,
  readOnly = false,
  selectedBlock,
  setSelectedBlock,
  isReordering,
  selectedBlockLevel,
  onReorder,
}: DocBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const hasChildSelected = useCallback(
    (b: Block): boolean => {
      return b.children.some(
        (c) =>
          c.id === selectedBlock ||
          (c.children.length > 0 && hasChildSelected(c)),
      );
    },
    [selectedBlock],
  );

  function getClassesByLevel(level: number) {
    const byLevel = classesByLevel[level as keyof typeof classesByLevel] || "";
    const isSelected = block.id === selectedBlock;
    const selected = isSelected
      ? "bg-selected/8 shadow-selected/15 [&_p]:bg-transparent [&_div[contenteditable]]:bg-transparent"
      : "";

    const childIsSelected = level === 3 && hasChildSelected(block);
    const opacity =
      !readOnly && level === 3 && !isSelected && !childIsSelected
        ? "opacity-60 transition-opacity duration-200"
        : "";

    return `${byLevel} ${selected} ${opacity}`;
  }

  return (
    <div
      id={`block-${block.id}`}
      className={`relative rounded-lg ${getClassesByLevel(block.level)}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlock(block.id);
      }}
    >
      <BlockHeader
        block={block}
        readOnly={readOnly}
        handleTitleChange={handleTitleChange}
        toggleCollapse={toggleCollapse}
        selectedBlock={selectedBlock}
        isReordering={isReordering}
        selectedBlockLevel={selectedBlockLevel}
        onReorder={onReorder}
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
            className={`text-foreground/85 min-h-[1.5em]
                empty:before:content-['Escreva_aqui...'] pl-9.5 pb-2 pr-3
                empty:before:text-muted-foreground/50
                ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
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
          {block.children
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((child) => (
              <DocBlock
              key={child.id}
              block={child}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
              readOnly={readOnly}
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
              isReordering={isReordering}
              selectedBlockLevel={selectedBlockLevel}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
};
