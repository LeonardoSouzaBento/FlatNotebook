import { Block } from "@/types/document";
import { Button, Icon } from "@/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { ScrollArea } from "@/ui/scroll-area";
import { Trash } from "lucide-react";
import React from "react";

interface DeleteButtonWithModalProps {
  onDelete: () => void;
  block: Block;
}

const renderBlockPreview = (block: Block) => (
  <div key={block.id} className="mb-2">
    <div className={`font-sans font-semibold h${block.level}`}>
      {block.title}
    </div>
    {block.content && (
      <p className="text-sm text-muted-foreground">{block.content}</p>
    )}
    {block.children.length > 0 && (
      <div className="ml-4 mt-1">
        {block.children.map((child) => renderBlockPreview(child))}
      </div>
    )}
  </div>
);

export const DeleteButtonWithModal: React.FC<DeleteButtonWithModalProps> = ({
  onDelete,
  block,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="transparent" size="icon" aria-label="Remover bloco">
          <Icon
            Icon={Trash}
            strokeWidth="light"
            color="var(--color-destructive)"
            fill="var(--color-destructive-icon)"
            size="sm"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir bloco</AlertDialogTitle>
          <AlertDialogDescription>
            Este bloco e todo o seu conteúdo serão excluídos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-60 rounded-md border border-border bg-muted/30 p-4">
          {renderBlockPreview(block)}
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
