import { X } from "lucide-react";
import React from "react";

interface CloseButtonProps {
  setMode: (mode: "view" | "resize" | "crop") => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ setMode }) => {
  return (
    <div className="absolute top-2 right-2 z-30">
      <button
        onClick={() => setMode("view")}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors"
      >
        <X className="w-3.5 h-3.5 text-foreground" />
      </button>
    </div>
  );
};
