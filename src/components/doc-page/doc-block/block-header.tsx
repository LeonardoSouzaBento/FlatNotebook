import type { Block } from "@/types/document";
import { Button, Icon } from "@/ui";
import { ArrowUpDown, Copy } from "lucide-react";
import type { FocusEvent } from "react";
import {
  AddChildBlockBtn,
  AddImageButton,
  BlockTitle,
  CollapseToggle,
  DeleteButtonWithModal,
} from "./block-header/index";

interface BlockHeaderProps {
  block: Block;
  readOnly: boolean;
  handleTitleChange: (e: FocusEvent<HTMLHeadingElement>) => void;
  toggleCollapse: () => void;
  handleImageAdd: () => void;
  onDelete: (blockId: string) => void;
  isHovered: boolean;
  canAddChildren: boolean;
  addChildBlock: () => void;
}

export const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  readOnly,
  handleTitleChange,
  toggleCollapse,
  handleImageAdd,
  onDelete,
  isHovered,
  canAddChildren,
  addChildBlock,
}) => {
  return (
    <div className="flex items-center gap-1 mb-cap-offset">
      <CollapseToggle onClick={toggleCollapse} collapsed={block.collapsed} />

      <BlockTitle
        readOnly={readOnly}
        onBlur={handleTitleChange}
        onClick={readOnly ? toggleCollapse : undefined}
        level={block.level}
        title={block.title}
      />

      {isHovered && !readOnly && (
        <div className="flex items-center gap-1.5">
          <DeleteButtonWithModal
            onDelete={() => onDelete(block.id)}
            block={block}
          />
          <Button variant="transparent" size="icon-sm">
            <Icon Icon={ArrowUpDown} strokeWidth="light" size="sm" />
          </Button>

          <Button variant="transparent" size="icon-sm">
            <Icon Icon={Copy} strokeWidth="light" size="sm" />
          </Button>


          <AddImageButton onClick={handleImageAdd} />

          <AddChildBlockBtn
            canAddChildren={canAddChildren}
            readOnly={readOnly}
            onClick={addChildBlock}
          />
        </div>
      )}
    </div>
  );
};
