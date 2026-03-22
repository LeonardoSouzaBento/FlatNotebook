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
    <Button
      onClick={onClick}
      variant="transparent"
      size="icon-sm"
      className={`w-6 text-muted-foreground rounded-md -mt-1 
        ${selectedBlock === blockId ? "hover:bg-selected/14" : ""}`}
      aria-label={collapsed ? "Expandir" : "Colapsar"}
    >
      <Icon
        Icon={ChevronRight}
        className={`transition-transform duration-200 ml-px ${
          collapsed ? "" : "rotate-90"
        }`}
        size="sm"
      />
    </Button>
  );
};
