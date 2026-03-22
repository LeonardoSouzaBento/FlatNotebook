import type { Block } from "@/types/document";
import type { FocusEvent } from "react";
import { BlockTitle, CollapseToggle } from "./block-header/index";

interface BlockHeaderProps {
  block: Block;
  readOnly: boolean;
  handleTitleChange: (e: FocusEvent<HTMLHeadingElement>) => void;
  toggleCollapse: () => void;
  selectedBlock: string;
  isReordering?: boolean;
  selectedBlockLevel?: number;
  onReorder?: (targetId: string) => void;
}

export const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  readOnly,
  handleTitleChange,
  toggleCollapse,
  selectedBlock,
  isReordering,
  selectedBlockLevel,
  onReorder,
}) => {
  const showCheckbox =
    isReordering &&
    block.id !== selectedBlock &&
    (selectedBlockLevel === undefined || block.level === selectedBlockLevel);

  return (
    <div className="flex items-center gap-1.5 mb-cap-offset pl-2 pr-3">
      {showCheckbox ? (
        <div className="w-6 h-6 flex items-center justify-center">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            onChange={() => onReorder?.(block.id)}
          />
        </div>
      ) : (
        <CollapseToggle
          onClick={toggleCollapse}
          collapsed={block.collapsed}
          selectedBlock={selectedBlock}
          blockId={block.id}
        />
      )}

      <BlockTitle
        readOnly={readOnly}
        onBlur={handleTitleChange}
        level={block.level}
        title={block.title}
      />
    </div>
  );
};
