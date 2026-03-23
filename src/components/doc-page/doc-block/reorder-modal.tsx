import { Block } from "@/types/document";
import { Button, Icon } from "@/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { GripVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/ui/scroll-area";

interface ReorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siblings: Block[];
  onReorder: (newOrder: Block[]) => void;
  selectedBlockId: string;
}

export const ReorderModal: React.FC<ReorderModalProps> = ({
  open,
  onOpenChange,
  siblings,
  onReorder,
  selectedBlockId,
}) => {
  const [items, setItems] = useState<Block[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setItems([...siblings]);
    }
  }, [open, siblings]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Add a ghost image or styling if needed
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Move item in the list
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  const handleItemClick = (index: number) => {
    const selectedIdx = items.findIndex((item) => item.id === selectedBlockId);
    if (selectedIdx === -1 || selectedIdx === index) return;

    // Swap positions
    const newItems = [...items];
    [newItems[selectedIdx], newItems[index]] = [
      newItems[index],
      newItems[selectedIdx],
    ];
    setItems(newItems);
  };

  const handleConfirm = () => {
    onReorder(items);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reordenar</DialogTitle>
          <DialogDescription>
            Arraste e solte os items para reordenar
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="flex flex-col gap-2 py-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onClick={() => handleItemClick(index)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border bg-card transition-all
                  ${draggedIndex === index ? "opacity-50 scale-95 border-primary/50 shadow-inner" : "hover:border-primary/30"}
                  ${item.id === selectedBlockId ? "ring-1 ring-primary/20 bg-primary/5" : ""}
                  cursor-grab active:cursor-grabbing
                `}
              >
                <Icon
                  Icon={GripVertical}
                  size="sm"
                  strokeWidth="light"
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium truncate">
                  {item.title || "Sem título"}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Reordenar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
