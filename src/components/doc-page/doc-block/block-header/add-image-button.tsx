import React from "react";
import { ImagePlus } from "lucide-react";
import { Button, Icon } from "@/ui";

interface AddImageButtonProps {
  onClick: () => void;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="transparent"
      size="icon"
      onClick={onClick}
      aria-label="Adicionar imagem"
    >
      <Icon Icon={ImagePlus} strokeWidth="light" />
    </Button>
  );
};
