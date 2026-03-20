import { Button, Icon } from "@/ui";
import { Plus } from "lucide-react";

export const AddBlockButton = ({ addChapter }: { addChapter: () => void }) => {
  return (
    <Button
      size="icon-lg"
      onClick={addChapter}
      className="fixed bottom-8 right-8 rounded-full shadow-lg hover:shadow-xl"
      aria-label="Adicionar capítulo"
    >
      <Icon Icon={Plus} size="2xl" strokeWidth="thin" />
    </Button>
  );
};
