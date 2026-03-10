import React, { useState, useCallback } from "react";
import { Document, Block } from "@/types/document";
import { sampleDocument } from "@/data/sampleDocument";
import DocumentBlock from "@/components/DocumentBlock";
import TableOfContents from "@/components/TableOfContents";

const DocumentPage: React.FC = () => {
  const [doc, setDoc] = useState<Document>(sampleDocument);

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (newTitle !== doc.title) {
        setDoc((d) => ({ ...d, title: newTitle, updatedAt: new Date().toISOString() }));
      }
    },
    [doc.title]
  );

  const handleSubtitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newSub = e.currentTarget.textContent || "";
      if (newSub !== doc.subtitle) {
        setDoc((d) => ({ ...d, subtitle: newSub, updatedAt: new Date().toISOString() }));
      }
    },
    [doc.subtitle]
  );

  const handleBlockUpdate = useCallback((updatedBlock: Block) => {
    setDoc((d) => ({
      ...d,
      updatedAt: new Date().toISOString(),
      blocks: d.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
    }));
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setDoc((d) => ({
      ...d,
      updatedAt: new Date().toISOString(),
      blocks: d.blocks.filter((b) => b.id !== blockId),
    }));
  }, []);

  const addChapter = useCallback(() => {
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      level: 3,
      title: "Novo capítulo",
      content: "",
      collapsed: false,
      children: [],
    };
    setDoc((d) => ({
      ...d,
      updatedAt: new Date().toISOString(),
      blocks: [...d.blocks, newBlock],
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-medium text-foreground" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)' }}>
            FlatNotebook
          </span>
          <span className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
            Salvo automaticamente
          </span>
        </div>
      </header>

      {/* Document content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title H1 */}
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className="cursor-text px-1 rounded mb-2"
        >
          {doc.title}
        </h1>

        {/* Subtitle H2 */}
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={handleSubtitleChange}
          className="cursor-text px-1 rounded mb-8 text-muted-foreground"
        >
          {doc.subtitle || ""}
        </h2>

        {/* Table of Contents */}
        <TableOfContents blocks={doc.blocks} />

        {/* Blocks */}
        <div className="space-y-1">
          {doc.blocks.map((block) => (
            <DocumentBlock
              key={block.id}
              block={block}
              onUpdate={handleBlockUpdate}
              onDelete={handleBlockDelete}
            />
          ))}
        </div>
      </main>

      {/* FAB - Add chapter */}
      <button
        onClick={addChapter}
        className="fixed bottom-8 right-8 w-14 h-14 bg-fab hover:bg-fab-hover text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Adicionar capítulo"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default DocumentPage;
