import React, {
  useState,
  useCallback,
  useRef,
  FocusEvent,
  ChangeEvent,
} from "react";
import { Block, BlockImage as BlockImageType } from "@/types/document";
import { BlockImageItem } from "@/components/doc-page/block-image";
import {
  CollapseToggle,
  BlockTitle,
  AddImageButton,
  DeleteButtonWithModal,
  AddChildBlockBtn,
} from "./doc-block/index";



interface DocumentBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: (blockId: string) => void;
  readOnly?: boolean;
}

const MAX_DEPTH = 6;

const renderBlockPreview = (block: Block): React.ReactNode => (
  <div key={block.id} className="mb-2">
    <div className={`font-sans font-semibold h${block.level}`}>
      {block.title}
    </div>
    {block.content && (
      <p className="text-sm text-muted-foreground">{block.content}</p>
    )}
    {block.children.length > 0 && (
      <div className="ml-4 mt-1">
        {block.children.map((child) => renderBlockPreview(child))}
      </div>
    )}
  </div>
);

export const DocBlock: React.FC<DocumentBlockProps> = ({
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
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        {/* collapse-toggle */}
        <CollapseToggle onClick={toggleCollapse} collapsed={block.collapsed} />


        {/* block-title */}
        <BlockTitle
          readOnly={readOnly}
          onBlur={handleTitleChange}
          onClick={readOnly ? toggleCollapse : undefined}
          level={block.level}
          title={block.title}
        />


        {isHovered && !readOnly && (
          <div className="flex items-center gap-1">
            {/* add-image-button */}
            <AddImageButton onClick={handleImageAdd} />

            {/* delete-button-with-modal */}
            <DeleteButtonWithModal
              onDelete={() => onDelete(block.id)}
              block={block}
              renderPreview={renderBlockPreview}
            />

          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!block.collapsed && (
        <div className="pl-8">
          <p
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={handleContentChange}
            onClick={readOnly ? toggleCollapse : undefined}
            className={`rounded text-foreground/85 min-h-[1.5em] font-sans empty:before:content-['Escreva_aqui...'] empty:before:text-muted-foreground/50 ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
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

          {/* add-child-block-btn */}
          <AddChildBlockBtn
            canAddChildren={canAddChildren}
            readOnly={readOnly}
            onClick={addChildBlock}
            level={block.level}
          />
        </div>
      )}
    </div>
  );
};
