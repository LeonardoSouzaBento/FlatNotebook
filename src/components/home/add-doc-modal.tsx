import { StateSetter } from "@/types/react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/ui";

interface AddDocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTitle: string;
  setNewTitle: StateSetter<string>;
  newSubtitle: string;
  setNewSubtitle: StateSetter<string>;
  onSubmit: () => void;
}

export const AddDocModal = ({
  open,
  onOpenChange,
  newTitle,
  setNewTitle,
  newSubtitle,
  setNewSubtitle,
  onSubmit,
}: AddDocModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle className="font-sans">Novo documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium text-foreground font-sans block mb-1.5">
              Título *
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nome do documento"
              className="font-sans"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground font-sans block mb-1.5">
              Subtítulo
            </label>
            <Input
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              placeholder="Subtítulo (opcional)"
              className="font-sans"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-sans"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!newTitle.trim()}
            className="font-sans"
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
