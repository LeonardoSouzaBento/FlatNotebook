import { Button, Switch } from "@/ui";
import { ThemeToggle } from "@/components/common";
import { BooleanSetter } from "@/types/react";

export const TopOptions = ({
  readOnly,
  setReadOnly,
}: {
  readOnly: boolean;
  setReadOnly: BooleanSetter;
}) => {
  return (
    <div className="flex justify-end items-center gap-2 mb-4">
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setReadOnly((r) => !r)}
      >
        Somente leitura
        <Switch
          checked={readOnly}
          onCheckedChange={setReadOnly}
          className="pointer-events-none"
        />
      </Button>
      <ThemeToggle />
    </div>
  );
};
