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
    <div className="bg-toc-bg rounded-lg py-2.5 px-2 mb-8">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.25 w-full text-left"
      >
        <Button variant="transparent" size="icon-sm" asChild>
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

        <span className="font-[375] text-muted-foreground text-lg uppercase tracking-wider">
          Sumário
        </span>
      </button>

      {!collapsed && (
        <nav className="mt-3 space-y-1">
          {blocks.map((block, index) => (
            <button
              key={block.id}
              onClick={() => handleClick(block.id)}
              className="block w-full text-left px-2 py-1 hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors"
              style={{ fontSize: "var(--text-base)" }}
            >
              <span className="text-muted-foreground mr-2">{index + 1}</span>
              {block.title}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};
