import { Button, Icon } from "@/ui";
import { ChevronRight } from "lucide-react";
import React from "react";

interface CollapseToggleProps {
  onClick: () => void;
  collapsed: boolean;
}

export const CollapseToggle: React.FC<CollapseToggleProps> = ({
  onClick,
  collapsed,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="transparent"
      size="icon-sm"
      className="text-muted-foreground"
      aria-label={collapsed ? "Expandir" : "Colapsar"}
    >
      <Icon
        Icon={ChevronRight}
        className={`transition-transform duration-200 ${
          collapsed ? "" : "rotate-90"
        }`}
        size="sm"
      />
    </Button>
  );
};
