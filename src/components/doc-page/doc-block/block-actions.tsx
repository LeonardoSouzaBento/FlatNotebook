import type { Block } from "@/types/document";
import { Button, Icon } from "@/ui";
import { ArrowUpDown, Copy } from "lucide-react";
import {
  AddChildBlockBtn,
  AddImageButton,
  DeleteButtonWithModal,
} from "./block-header/index";

interface BlockActionsProps {
  block: Block;
  readOnly: boolean;
  onDelete: (blockId: string) => void;
  handleImageAdd: () => void;
  canAddChildren: boolean;
  addChildBlock: () => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({
  block,
  readOnly,
  onDelete,
  handleImageAdd,
  canAddChildren,
  addChildBlock,
}) => {
  if (readOnly) return null;

  return (
    <div className="h-full flex items-center justify-between gap-1.5">
      <DeleteButtonWithModal
        onDelete={() => onDelete(block.id)}
        block={block}
      />
      <Button variant="transparent" size="icon">
        <Icon Icon={ArrowUpDown} strokeWidth="light" />
      </Button>

      <Button variant="transparent" size="icon">
        <Icon Icon={Copy} strokeWidth="light" />
      </Button>

      <AddImageButton onClick={handleImageAdd} />

      <AddChildBlockBtn
        canAddChildren={canAddChildren}
        readOnly={readOnly}
        onClick={addChildBlock}
      />
    </div>
  );
};
