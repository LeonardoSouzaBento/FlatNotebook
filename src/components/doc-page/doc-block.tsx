import { useBlockHandlers } from "@/hooks/use-block-handlers";
import { Block } from "@/types/document";
import { StateSetter } from "@/types/react";
import { useCallback, useRef } from "react";
import { BlockHeader, BlockImageItem } from "./doc-block/index";
import { cva } from "class-variance-authority";
import { formatText, parseHtmlToFormat } from "@/utils/format-text";
// import { log } from "console";

interface DocBlockProps {
  block: Block;
  onUpdate: (block: Block) => void;
  readOnly?: boolean;
  selectedBlock: string;
  setSelectedBlock: StateSetter<string>;
}

const classesByLevel = {
  3: "pt-2 pb-1.25 mb-4 last:mb-0",
  4: "pt-2.5 pb-0.5 rounded-md",
  5: "pt-2.5 pb-0.75 mb-0 last:mb-0",
  6: "pt-2.25 pb-0.5",
};

const paragraph = cva(
  "text-foreground/85 min-h-[1.5em] \
   empty:before:content-['Escreva_aqui...'] \
   first:pt-[0.16875rem] pl-9.5 pb-3.25 pr-4 \
   empty:before:text-muted-foreground/50",
  {
    variants: {
      readOnly: {
        true: "cursor-pointer select-none",
        false: "cursor-text",
      },
    },
  },
);

export const DocBlock = ({
  block,
  onUpdate,
  readOnly = false,
  selectedBlock,
  setSelectedBlock,
}: DocBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    toggleCollapse,
    handleTitleChange,
    handleContentChange,
    handleChildUpdate,
    handleFileChange,
    handleImageUpdate,
    handleImageDelete,
  } = useBlockHandlers({
    block,
    onUpdate,
    fileInputRef,
  });

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
    const selected =
      isSelected && !readOnly
        ? `bg-selected/9 dark:bg-selected/24 shadow-selected/15 
        [&_p]:bg-transparent [&_div[contenteditable]]:bg-transparent`
        : "";
    const parentReadOnly = readOnly && level === 3 ? "border border/50" : "";

    const childIsSelected = level === 3 && hasChildSelected(block);
    const opacity =
      !readOnly && level === 3 && !isSelected && !childIsSelected
        ? "opacity-60 transition-opacity duration-200"
        : "";

    return `${byLevel} ${selected} ${opacity} ${parentReadOnly}`;
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
          {block.content.length === 0 && !readOnly ? (
            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newHtml = e.currentTarget.innerHTML || "";
                const newText = parseHtmlToFormat(newHtml);
                if (newText) {
                  onUpdate({ ...block, content: [newText] });
                }
              }}
              className={paragraph({ readOnly })}
            />
          ) : (
            block.content.map((text, index) => (
              <p
                key={index}
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange(index, e)}
                className={paragraph({ readOnly })}
                dangerouslySetInnerHTML={{ __html: formatText(text) }}
              />
            ))
          )}
          {readOnly &&
            block.level === 3 &&
            !block.content.length &&
            block.children.length === 0 && (
              <p className="text-muted-foreground/66 pl-9.5">
                Capítulo vazio...
              </p>
            )}
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
                readOnly={readOnly}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
              />
            ))}
        </div>
      )}
    </div>
  );
};
