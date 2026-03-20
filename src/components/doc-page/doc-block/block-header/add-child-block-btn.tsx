import { Button, Icon } from "@/ui";
import { Plus } from "lucide-react";
import React from "react";

interface AddChildBlockBtnProps {
  canAddChildren: boolean;
  readOnly: boolean;
  onClick: () => void;
}

export const AddChildBlockBtn: React.FC<AddChildBlockBtnProps> = ({
  canAddChildren,
  readOnly,
  onClick,
}) => {
  if (!canAddChildren || readOnly) return null;

  return (
    <Button variant="transparent" size="icon-sm" onClick={onClick}>
      <Icon Icon={Plus} strokeWidth="light" />
    </Button>
  );
};
