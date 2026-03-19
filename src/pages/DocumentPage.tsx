import {
  AddBlockButton,
  DocBlock,
  Header,
  Summary,
  TopOptions,
} from "@/components/doc-page";
import { sampleDocument } from "@/data/sampleDocument";
import { Block, Document } from "@/types/document";
import React, { useCallback, useState } from "react";

const DocumentPage: React.FC = () => {
  const [doc, setDoc] = useState<Document>(sampleDocument);
  const [readOnly, setReadOnly] = useState(false);

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (newTitle !== doc.title) {
        setDoc((d) => ({
          ...d,
          title: newTitle,
          updatedAt: new Date().toISOString(),
        }));
      }
    },
    [doc.title],
  );

  const handleSubtitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newSub = e.currentTarget.textContent || "";
      if (newSub !== doc.subtitle) {
        setDoc((d) => ({
          ...d,
          subtitle: newSub,
          updatedAt: new Date().toISOString(),
        }));
      }
    },
    [doc.subtitle],
  );

  const handleBlockUpdate = useCallback((updatedBlock: Block) => {
    setDoc((d) => ({
      ...d,
      updatedAt: new Date().toISOString(),
      blocks: d.blocks.map((b) =>
        b.id === updatedBlock.id ? updatedBlock : b,
      ),
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
      <Header />
      {/* Document content */}
      <main className="max-w-3xl mx-auto px-6 py-2">
        <TopOptions readOnly={readOnly} setReadOnly={setReadOnly} />
        {/* Title H1 */}
        <h1
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className={`px-1 rounded mb-2 ${readOnly ? "pointer-events-none" : "cursor-text"}`}
        >
          {doc.title}
        </h1>

        {/* Subtitle H2 */}
        <h2
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleSubtitleChange}
          className={`px-1 rounded mb-8 text-muted-foreground ${readOnly ? "pointer-events-none" : "cursor-text"}`}
        >
          {doc.subtitle || ""}
        </h2>

        {/* Table of Contents */}
        <Summary blocks={doc.blocks} />

        {/* Blocks */}
        <div className="space-y-1">
          {doc.blocks.map((block) => (
            <DocBlock
              key={block.id}
              block={block}
              onUpdate={handleBlockUpdate}
              onDelete={handleBlockDelete}
              readOnly={readOnly}
            />
          ))}
        </div>
      </main>

      {/* FAB - Add chapter */}
      {!readOnly && <AddBlockButton addChapter={addChapter} />}
    </div>
  );
};

export default DocumentPage;
