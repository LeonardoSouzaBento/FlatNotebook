import { Button } from "@/ui/button";
import React from "react";

interface CropButtonsProps {
  commitCrop: () => void;
  cancelCrop: () => void;
}

export const CropButtons: React.FC<CropButtonsProps> = ({ commitCrop, cancelCrop }) => {
  return (
    <div className="flex gap-2 mt-1">
      <Button size="sm" onClick={commitCrop} className="h-8">
        Recortar
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={cancelCrop}
        className="h-8"
      >
        Cancelar
      </Button>
    </div>
  );
};
