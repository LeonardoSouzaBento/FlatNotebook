import React, { useState } from "react";
import { Block } from "@/types/document";
import { Button, Icon } from "@/ui";
import { ChevronRight } from "lucide-react";

interface SummaryProps {
  blocks: Block[];
}

export const DocSummary: React.FC<SummaryProps> = ({ blocks }) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleClick = (blockId: string) => {
    const el = document.getElementById(`block-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-muted/66 rounded-lg py-2.5 px-2 mb-6">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.25 w-full text-left"
      >
        <Button variant="transparent" size="icon-xs" asChild data-rounded className="mb-px ml-px">
          <div>
            <Icon
              Icon={ChevronRight}
              className={`pl-px text-muted-foreground transition-transform duration-200 ${
                collapsed ? "" : "rotate-90"
              }`}
              strokeWidth="light"
              size="md"
            />
          </div>
        </Button>

        <span className="font-normal text-muted-foreground text-lg uppercase tracking-wider">
          Sumário
        </span>
      </button>

      {!collapsed && (
        <nav className="mt-2 space-y-1">
          {blocks
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((block, index) => (
              <Button
              variant="transparent"
              size="sm"
              key={block.id}
              onClick={() => handleClick(block.id)}
              className="block w-full text-left px-3 hover:bg-primary-50 transition-colors"
            >
              <span className="mr-2 font-[350]">{index + 1}</span>
              {block.title}
            </Button>
          ))}
        </nav>
      )}
    </div>
  );
};
