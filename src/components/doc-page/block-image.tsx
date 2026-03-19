import { BlockImage } from "@/types/document";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Crop, Maximize2, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface BlockImageItemProps {
  image: BlockImage;
  onUpdate: (image: BlockImage) => void;
  onDelete: (imageId: string) => void;
}

export const BlockImageItem: React.FC<BlockImageItemProps> = ({
  image,
  onUpdate,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [resizeOpen, setResizeOpen] = useState(false);

  const [cropValues, setCropValues] = useState({
    x: image.edits.crop?.x ?? 0,
    y: image.edits.crop?.y ?? 0,
    width: image.edits.crop?.width ?? 100,
    height: image.edits.crop?.height ?? 100,
  });

  const [resizeValues, setResizeValues] = useState({
    width: image.edits.resize?.width ?? 100,
    height: image.edits.resize?.height ?? 100,
  });

  const applyCrop = () => {
    onUpdate({
      ...image,
      edits: { ...image.edits, crop: { ...cropValues } },
    });
    setCropOpen(false);
  };

  const applyResize = () => {
    onUpdate({
      ...image,
      edits: { ...image.edits, resize: { ...resizeValues } },
    });
    setResizeOpen(false);
  };

  const displayStyle: React.CSSProperties = {};
  if (image.edits.resize) {
    displayStyle.width = `${image.edits.resize.width}%`;
  }
  if (image.edits.crop) {
    const c = image.edits.crop;
    displayStyle.objectPosition = `${c.x}% ${c.y}%`;
    displayStyle.objectFit = "cover";
  }

  return (
    <>
      <div className="relative group my-2 inline-block">
        <img
          src={image.src}
          alt={image.alt || ""}
          className="rounded-md border border-border max-w-full"
          style={displayStyle}
        />

        {/* 3-dot menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  setCropOpen(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                aria-label="Cortar imagem"
              >
                <Crop className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setResizeOpen(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                aria-label="Redimensionar imagem"
              >
                <Maximize2 className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(image.id);
                }}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors"
                aria-label="Remover imagem"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Edit badges */}
        {(image.edits.crop || image.edits.resize) && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {image.edits.crop && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border text-muted-foreground">
                Cortada
              </span>
            )}
            {image.edits.resize && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border text-muted-foreground">
                {image.edits.resize.width}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Crop Dialog */}
      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cortar imagem</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>X (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={cropValues.x}
                onChange={(e) =>
                  setCropValues((v) => ({ ...v, x: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Y (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={cropValues.y}
                onChange={(e) =>
                  setCropValues((v) => ({ ...v, y: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Largura (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={cropValues.width}
                onChange={(e) =>
                  setCropValues((v) => ({
                    ...v,
                    width: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Altura (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={cropValues.height}
                onChange={(e) =>
                  setCropValues((v) => ({
                    ...v,
                    height: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={applyCrop}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resize Dialog */}
      <Dialog open={resizeOpen} onOpenChange={setResizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redimensionar imagem</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Largura (%)</Label>
              <Input
                type="number"
                min={10}
                max={200}
                value={resizeValues.width}
                onChange={(e) =>
                  setResizeValues((v) => ({
                    ...v,
                    width: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Altura (%)</Label>
              <Input
                type="number"
                min={10}
                max={200}
                value={resizeValues.height}
                onChange={(e) =>
                  setResizeValues((v) => ({
                    ...v,
                    height: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResizeOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={applyResize}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
