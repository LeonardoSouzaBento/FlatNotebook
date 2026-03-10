import React, { useState, useCallback } from "react";
import { Block } from "@/types/document";

interface DocumentBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: (blockId: string) => void;
}

const MAX_DEPTH = 6;

const DocumentBlock: React.FC<DocumentBlockProps> = ({
  block,
  onUpdate,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
    [block, onUpdate]
  );

  const handleContentChange = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      const newContent = e.currentTarget.textContent || "";
      if (newContent !== block.content) {
        onUpdate({ ...block, content: newContent });
      }
    },
    [block, onUpdate]
  );

  const handleChildUpdate = useCallback(
    (updatedChild: Block) => {
      const newChildren = block.children.map((c) =>
        c.id === updatedChild.id ? updatedChild : c
      );
      onUpdate({ ...block, children: newChildren });
    },
    [block, onUpdate]
  );

  const handleChildDelete = useCallback(
    (childId: string) => {
      const newChildren = block.children.filter((c) => c.id !== childId);
      onUpdate({ ...block, children: newChildren });
    },
    [block, onUpdate]
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

  const canAddChildren = block.level < MAX_DEPTH;

  const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Title */}
        <HeadingTag
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className="flex-1 cursor-text rounded font-sans"
        >
          {block.title}
        </HeadingTag>

        {/* Delete button */}
        {isHovered && (
          <button
            onClick={() => onDelete(block.id)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remover bloco"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content & Children (collapsible) */}
      {!block.collapsed && (
        <div>
          {/* Content */}
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleContentChange}
            className="cursor-text rounded text-foreground/85 min-h-[1.5em] font-sans empty:before:content-['Escreva_aqui...'] empty:before:text-muted-foreground/50"
          >
            {block.content}
          </p>

          {/* Children */}
          {block.children.map((child) => (
            <DocumentBlock
              key={child.id}
              block={child}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
            />
          ))}

          {/* Add child block button */}
          {canAddChildren && (
            <button
              onClick={addChildBlock}
              className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-accent text-sm rounded hover:bg-muted transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-sans">Adicionar H{block.level + 1}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentBlock;
