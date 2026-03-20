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
    <button
      onClick={onClick}
      className="shrink-0 size-8 flex items-center justify-center 
      rounded-md hover:bg-muted text-muted-foreground transition-colors"
      aria-label={collapsed ? "Expandir" : "Colapsar"}
    >
      <svg
        className={`size-3.75 transition-transform duration-200 ${
          collapsed ? "" : "rotate-90"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
};
