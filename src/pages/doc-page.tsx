import {
  AddBlockButton,
  DocBlock,
  DocHeader,
  DocSummary,
  PageHeader,
} from "@/components/doc-page";
import { useDocPageContext } from "@/contexts";
import { Block } from "@/types/document";
import type { FocusEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DocPage = () => {
  const { id } = useParams();
  const [readOnly, setReadOnly] = useState(false);

  const { documents, doc, setDoc } = useDocPageContext();

  useEffect(() => {
    if (!id) return;
    const foundDoc = documents.find((d) => String(d.id) === id);
    if (foundDoc) {
      setDoc(foundDoc);
    } else {
      setDoc(null);
    }
  }, [id, documents, setDoc]);

  const handleTitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.currentTarget.textContent || "";
      if (doc && newTitle !== doc.title) {
        setDoc((d) => {
          if (!d) return d;
          return {
            ...d,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
        });
      }
    },
    [doc, setDoc],
  );

  const handleSubtitleChange = useCallback(
    (e: FocusEvent<HTMLHeadingElement>) => {
      const newSub = e.currentTarget.textContent || "";
      if (doc && newSub !== doc.subtitle) {
        setDoc((d) => {
          if (!d) return d;
          return {
            ...d,
            subtitle: newSub,
            updatedAt: new Date().toISOString(),
          };
        });
      }
    },
    [doc, setDoc],
  );

  const handleBlockUpdate = useCallback((updatedBlock: Block) => {
    setDoc((d) => {
      if (!d) return d;
      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: d.blocks.map((b) =>
          b.id === updatedBlock.id ? updatedBlock : b,
        ),
      };
    });
  }, [setDoc]);

  const handleBlockDelete = useCallback((blockId: string) => {
    setDoc((d) => {
      if (!d) return d;
      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: d.blocks.filter((b) => b.id !== blockId),
      };
    });
  }, [setDoc]);

  const addChapter = useCallback(() => {
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      level: 3,
      title: "Novo capítulo",
      content: "",
      collapsed: false,
      children: [],
    };
    setDoc((d) => {
      if (!d) return d;
      return {
        ...d,
        updatedAt: new Date().toISOString(),
        blocks: [...d.blocks, newBlock],
      };
    });
  }, [setDoc]);

  if (!id || !doc) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader readOnly={readOnly} setReadOnly={setReadOnly} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <DocHeader
          doc={doc}
          readOnly={readOnly}
          handleTitleChange={handleTitleChange}
          handleSubtitleChange={handleSubtitleChange}
        />

        <DocSummary blocks={doc.blocks} />

        <div className="space-y-4">
          {doc.blocks.map((block) => {
            return (
              <DocBlock
                key={block.id}
                block={block}
                onUpdate={handleBlockUpdate}
                onDelete={handleBlockDelete}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      </main>
      {!readOnly && <AddBlockButton addChapter={addChapter} />}
    </div>
  );
};

export default DocPage;
