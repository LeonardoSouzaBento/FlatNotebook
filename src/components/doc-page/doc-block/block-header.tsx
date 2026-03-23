import type { Block } from "@/types/document";
import type { FocusEvent } from "react";
import { BlockTitle, CollapseToggle } from "./block-header/index";

interface BlockHeaderProps {
  block: Block;
  readOnly: boolean;
  handleTitleChange: (e: FocusEvent<HTMLHeadingElement>) => void;
  toggleCollapse: () => void;
  selectedBlock: string;
}

export const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  readOnly,
  handleTitleChange,
  toggleCollapse,
  selectedBlock,
}) => {
  return (
    <div className="flex items-center mb-ex-offset pl-1.5 pr-3">
      <CollapseToggle
        onClick={toggleCollapse}
        collapsed={block.collapsed}
        selectedBlock={selectedBlock}
        blockId={block.id}
      />

      <BlockTitle
        readOnly={readOnly}
        onBlur={handleTitleChange}
        level={block.level}
        title={block.title}
      />
    </div>
  );
};
