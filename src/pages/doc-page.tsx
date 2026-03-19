import {
  AddBlockButton,
  DocBlock,
  DocHeader,
  Header,
  Summary,
  TopOptions,
} from "@/components/doc-page";
import { sampleDocument } from "@/data/sampleDocument";
import { Block, Document } from "@/types/document";
import type { FocusEvent } from "react";
import { useCallback, useState } from "react";

const DocPage = () => {
  const [doc, setDoc] = useState<Document>(sampleDocument);
  const [readOnly, setReadOnly] = useState(false);

  const handleTitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
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
    (e: FocusEvent<HTMLHeadingElement>) => {
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
      <main className="max-w-3xl mx-auto px-6 py-2">
        <TopOptions readOnly={readOnly} setReadOnly={setReadOnly} />

        <DocHeader
          doc={doc}
          readOnly={readOnly}
          handleTitleChange={handleTitleChange}
          handleSubtitleChange={handleSubtitleChange}
        />

        <Summary blocks={doc.blocks} />

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
      {!readOnly && <AddBlockButton addChapter={addChapter} />}
    </div>
  );
};

export default DocPage;
