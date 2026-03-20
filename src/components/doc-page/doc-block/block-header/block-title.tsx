import React from "react";

interface BlockTitleProps {
  readOnly: boolean;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  onClick?: () => void;
  level: number;
  title: string;
}

export const BlockTitle: React.FC<BlockTitleProps> = ({
  readOnly,
  onBlur,
  onClick,
  level,
  title,
}) => {
  return (
    <div
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onBlur={onBlur}
      onClick={onClick}
      className={`flex-1 rounded font-sans h${level} ${readOnly ? "cursor-pointer select-none" : "cursor-text"}`}
      role="heading"
      aria-level={level}
    >
      {title}
    </div>
  );
};
