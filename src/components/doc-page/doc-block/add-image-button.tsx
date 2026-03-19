import React from "react";
import { ImagePlus } from "lucide-react";

interface AddImageButtonProps {
  onClick: () => void;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
      aria-label="Adicionar imagem"
    >
      <ImagePlus className="w-3.5 h-3.5" />
    </button>
  );
};
