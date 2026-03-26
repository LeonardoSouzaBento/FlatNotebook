import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Crop, Maximize2, MoreVertical, Trash2 } from "lucide-react";
import React from "react";

interface PopoverMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setMode: (mode: "view" | "resize" | "crop") => void;
  onDelete: () => void;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  menuOpen,
  setMenuOpen,
  setMode,
  onDelete,
}) => {
  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4 text-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-1 flex gap-1"
          side="left"
          align="start"
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              setMode("crop");
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
            aria-label="Cortar imagem"
          >
            <Crop className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              setMode("resize");
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
            aria-label="Redimensionar imagem"
          >
            <Maximize2 className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              onDelete();
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors"
            aria-label="Remover imagem"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
