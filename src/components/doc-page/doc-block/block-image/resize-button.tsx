import React from "react";

interface ResizeButtonProps {
  onMouseDown: (e: React.MouseEvent) => void;
  handleBase: string;
}

export const ResizeButton: React.FC<ResizeButtonProps> = ({ onMouseDown, handleBase }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`${handleBase} bottom-0 right-0 w-5 h-5 cursor-nwse-resize rounded-tl-md`}
      title="Arrastar para redimensionar"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className="text-primary-foreground"
      >
        <path
          d="M9 1L1 9M9 5L5 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
