import { Document } from "@/types/document";
import { Link } from "react-router-dom";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger } from "@/ui";
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
import { Trash, Pencil } from "lucide-react";

interface DocsGridProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onRename: (doc: Document) => void;
}

export const DocsGrid = ({ documents, onDelete, onRename }: DocsGridProps) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="relative group">
            <Link
              to={`/document/${doc.id}`}
              className="h-32 block text-left rounded-lg p-5 transition-colors shadow-xs
              border border-border/50 bg-primary-50 hover:bg-primary-100/45 w-full"
            >
              <h6 className="font-medium text-foreground text-base truncate mb-1 pr-6">
                {doc.title}
              </h6>
              {doc.subtitle && (
                <p className="text-sm-button text-muted-foreground truncate font-[375]">
                  {doc.subtitle}
                </p>
              )}
              <p className="text-xs text-muted-foreground/60 mt-3 font-[375]">
                {doc.blocks.length}{" "}
                {doc.blocks.length === 1 ? "capítulo" : "capítulos"}
              </p>
            </Link>

            <div className="absolute top-2 right-2 z-20">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-primary-100 hover:bg-primary-100/70"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon Icon={Pencil} size="sm" strokeWidth="normal" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40" align="end" sideOffset={8}>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="transparent"
                      size="sm"
                      className="justify-start font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        onRename(doc);
                      }}
                    >
                      <Icon Icon={Pencil} />
                      Renomear
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="justify-start"
                        >
                          <Icon Icon={Trash} size="sm" strokeWidth="bold" />
                          Apagar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Excluir documento?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            "{doc.title}" e todo o seu conteúdo serão excluídos
                            permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(doc.id)}
                            variant="destructive"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
