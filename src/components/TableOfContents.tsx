import React, { useState } from "react";
import { Block } from "@/types/document";

interface TableOfContentsProps {
  blocks: Block[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ blocks }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (blockId: string) => {
    const el = document.getElementById(`block-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-toc-bg rounded-lg p-4 mb-8">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left"
      >
        <svg
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            collapsed ? "" : "rotate-90"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-muted-foreground uppercase tracking-wider" style={{ fontSize: 'var(--text-sm)' }}>
          Sumário
        </span>
      </button>

      {!collapsed && (
        <nav className="mt-3 space-y-1">
          {blocks.map((block, index) => (
            <button
              key={block.id}
              onClick={() => handleClick(block.id)}
              className="block w-full text-left px-2 py-1 rounded hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors"
              style={{ fontSize: 'var(--text-base)' }}
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

export default TableOfContents;
