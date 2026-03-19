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
      className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
      aria-label={collapsed ? "Expandir" : "Colapsar"}
    >
      <svg
        className={`w-3.5 h-3.5 transition-transform duration-200 ${
          collapsed ? "" : "rotate-90"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
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
