import React, { useState, useCallback, useRef } from "react";
import { Block, BlockImage as BlockImageType } from "@/types/document";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { ScrollArea } from "@/ui/scroll-area";
import { ImagePlus } from "lucide-react";
import { BlockImageItem } from "@/components/doc-page/block-image";

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
    (e: React.FocusEvent<HTMLElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (newTitle !== block.title) {
        onUpdate({ ...block, title: newTitle });
      }
    },
    [block, onUpdate],
  );

  const handleContentChange = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Block header */}
      <div className="flex items-center gap-2">
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
          aria-label={block.collapsed ? "Expandir" : "Colapsar"}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              block.collapsed ? "" : "rotate-90"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Title */}
        <div
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          onClick={readOnly ? toggleCollapse : undefined}
          className={`flex-1 rounded font-sans h${block.level} ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
          role="heading"
          aria-level={block.level}
        >
          {block.title}
        </div>

        {/* Action buttons on hover (hidden in read-only) */}
        {isHovered && !readOnly && (
          <div className="flex items-center gap-1">
            {/* Add image button */}
            <button
              onClick={handleImageAdd}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Adicionar imagem"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>

            {/* Delete button with confirmation modal */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remover bloco"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir bloco</AlertDialogTitle>
                  <AlertDialogDescription>
                    Este bloco e todo o seu conteúdo serão excluídos
                    permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <ScrollArea className="max-h-60 rounded-md border border-border bg-muted/30 p-4">
                  {renderBlockPreview(block)}
                </ScrollArea>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(block.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Content & Children (collapsible) */}
      {!block.collapsed && (
        <div className="pl-8">
          {/* Content */}
          <p
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={handleContentChange}
            onClick={readOnly ? toggleCollapse : undefined}
            className={`rounded text-foreground/85 min-h-[1.5em] font-sans empty:before:content-['Escreva_aqui...'] empty:before:text-muted-foreground/50 ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
          >
            {block.content}
          </p>

          {/* Images */}
          {(block.images || []).map((image) => (
            <BlockImageItem
              key={image.id}
              image={image}
              onUpdate={handleImageUpdate}
              onDelete={handleImageDelete}
            />
          ))}

          {/* Children */}
          {block.children.map((child) => (
            <DocBlock
              key={child.id}
              block={child}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
              readOnly={readOnly}
            />
          ))}

          {/* Add child block button */}
          {canAddChildren && !readOnly && (
            <button
              onClick={addChildBlock}
              className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-accent text-sm rounded hover:bg-muted transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-sans">Bloco {block.level + 1}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
