import React from "react";

interface AddChildBlockBtnProps {
  canAddChildren: boolean;
  readOnly: boolean;
  onClick: () => void;
  level: number;
}

export const AddChildBlockBtn: React.FC<AddChildBlockBtnProps> = ({
  canAddChildren,
  readOnly,
  onClick,
  level,
}) => {
  if (!canAddChildren || readOnly) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-accent text-sm rounded hover:bg-muted transition-colors"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="font-sans">Bloco {level + 1}</span>
    </button>
  );
};
