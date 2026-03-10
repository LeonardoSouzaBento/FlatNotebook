import React, { useState, useCallback } from "react";
import { Block } from "@/types/document";

interface DocumentBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: (blockId: string) => void;
  depth?: number;
}

const MAX_DEPTH = 6;

const DocumentBlock: React.FC<DocumentBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  depth = 0,
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
  const indent = (block.level - 3) * 24;

  return (
    <div
      id={`block-${block.id}`}
      className="relative group"
      style={{ marginLeft: `${indent}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 py-1.5">
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-surface-hover text-muted-foreground transition-colors"
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
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className={`flex-1 cursor-text px-1 rounded h${block.level}`}
          role="heading"
          aria-level={block.level}
        >
          {block.title}
        </div>

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
        <div className="pl-8">
          {/* Content */}
          {(block.content || true) && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleContentChange}
              className="cursor-text px-1 rounded text-foreground/85 mb-2 min-h-[1.5em] empty:before:content-['Escreva_aqui...'] empty:before:text-muted-foreground/50"
              data-placeholder="Escreva aqui..."
            >
              {block.content}
            </p>
          )}

          {/* Children */}
          {block.children.map((child) => (
            <DocumentBlock
              key={child.id}
              block={child}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
              depth={depth + 1}
            />
          ))}

          {/* Add child block button */}
          {canAddChildren && (
            <button
              onClick={addChildBlock}
              className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-accent text-sm py-1 px-1 rounded hover:bg-surface-hover transition-colors mt-1 mb-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)' }}>Adicionar H{block.level + 1}</span>
            </button>
          )}
        </div>
      )}

      {/* Subtle left border */}
      <div
        className="absolute left-3 top-8 bottom-0 w-px bg-block-border opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ display: block.collapsed ? "none" : "block" }}
      />
    </div>
  );
};

export default DocumentBlock;
