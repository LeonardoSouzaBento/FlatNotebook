import React from "react";
import { Block } from "@/types/document";
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

interface DeleteButtonWithModalProps {
  onDelete: () => void;
  block: Block;
  renderPreview: (block: Block) => React.ReactNode;
}

export const DeleteButtonWithModal: React.FC<DeleteButtonWithModalProps> = ({
  onDelete,
  block,
  renderPreview,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Remover bloco"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir bloco</AlertDialogTitle>
          <AlertDialogDescription>
            Este bloco e todo o seu conteúdo serão excluídos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-60 rounded-md border border-border bg-muted/30 p-4">
          {renderPreview(block)}
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
