import { Button, Icon } from "@/ui";
import { ChevronRight } from "lucide-react";
import React from "react";

interface CollapseToggleProps {
  onClick: () => void;
  collapsed: boolean;
  selectedBlock: string;
  blockId: string;
}

export const CollapseToggle: React.FC<CollapseToggleProps> = ({
  onClick,
  collapsed,
  selectedBlock,
  blockId,
}) => {
  return (
    <div className="size-8 -mb-px flex items-center 
          justify-start cursor-pointer shrink-0" onClick={onClick}>
      <Button
        variant="transparent"
        size="icon-xs"
        className={`text-muted-foreground rounded-full flex-none
          ${selectedBlock === blockId ? "hover:bg-selected/14" : ""}`}
        aria-label={collapsed ? "Expandir" : "Colapsar"}
      >
        <Icon
          Icon={ChevronRight}
          className={`transition-transform duration-200 ml-px mt-px ${
            collapsed ? "" : "rotate-90"
          }`}
          size="sm"
        />
      </Button>
    </div>
  );
};
