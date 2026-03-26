import { useDocPageContext } from "@/contexts";
import { findSiblingsInfo } from "@/hooks/use-reorder-block";
import type { Block, Document as Doc } from "@/types/document";
import { Button, Icon } from "@/ui";
import { ArrowUpDown, CodeXml, Copy } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  AddChildBlockBtn,
  AddImageButton,
  DeleteButtonWithModal,
} from "./block-header/index";
import { ReorderModal } from "./reorder-modal";

interface BlockActionsProps {
  block: Block;
  doc: Doc | null;
  readOnly: boolean;
  onDelete: (blockId: string) => void;
  handleImageAdd: () => void;
  canAddChildren: boolean;
  addChildBlock: () => void;
  onAddEquivalentBlock: () => void;
  onUpdateOrder: (newOrder: Block[]) => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({
  block,
  doc,
  readOnly,
  onDelete,
  handleImageAdd,
  canAddChildren,
  addChildBlock,
  onAddEquivalentBlock,
  onUpdateOrder,
}) => {
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const siblingsInfo = useMemo(() => {
    if (!doc) return null;
    return findSiblingsInfo(doc.blocks, block.id);
  }, [doc, block.id]);

  const siblings = useMemo(() => {
    return siblingsInfo?.siblings || [];
  }, [siblingsInfo]);
  
  const isRedundantPair = useMemo(() => {
    if (siblings.length !== 2) return false;
    const [a, b] = siblings;
    return (
      a.title === b.title &&
      a.content.length === 0 &&
      b.content.length === 0
    );
  }, [siblings]);

  const isReorderDisabled = siblings.length <= 1 || isRedundantPair;

  if (readOnly) return null;

  return (
    <div className="h-full flex items-center justify-between gap-1.5">
      <DeleteButtonWithModal
        onDelete={() => onDelete(block.id)}
        block={block}
      />
      
      <Button
        variant="transparent"
        size="icon"
        onClick={() => !isReorderDisabled && setIsReorderModalOpen(true)}
        className={isReorderDisabled ? "grayscale opacity-50 cursor-not-allowed" : ""}
        disabled={isReorderDisabled}
      >
        <Icon
          Icon={ArrowUpDown}
          strokeWidth="light"
        />
      </Button>

      <ReorderModal
        open={isReorderModalOpen}
        onOpenChange={setIsReorderModalOpen}
        siblings={siblings}
        onReorder={onUpdateOrder}
        selectedBlockId={block.id}
      />

      <Button variant="transparent" size="icon" onClick={onAddEquivalentBlock}>
        <Icon Icon={Copy} strokeWidth="light" />
      </Button>

      <Button variant="transparent" size="icon" >
        <Icon Icon={CodeXml} strokeWidth="light" />
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
