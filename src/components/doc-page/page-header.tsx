import {
  Logo,
  LogoIcon,
  LogoLink,
  LogoTitle,
  ThemeToggle,
} from "@/components/common";
import { BooleanSetter } from "@/types/react";
import { Button, Switch } from "@/ui";

export const PageHeader = ({
  readOnly,
  setReadOnly,
}: {
  readOnly: boolean;
  setReadOnly: BooleanSetter;
}) => {
  return (
    <header
      className="pt-2.5 pb-4 sticky top-0 z-10 bg-background/50 backdrop-blur-sm 
      shadow-sm/4 mb-8"
    >
      <div className="max-w-3xl mx-auto px-6 max-[500px]:flex-col 
      max-[500px]:gap-1.5 flex items-center justify-between">
        <Logo>
          <LogoLink className="text-h5 gap-1.5">
            <LogoIcon />
            <LogoTitle />
          </LogoLink>
        </Logo>
        <div className="flex justify-end items-center gap-4">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-full pr-1.5"
            onClick={() => setReadOnly((r) => !r)}
          >
            <div>
              <p className="text-sm-button font-heading">Somente leitura</p>
              <Switch
                checked={readOnly}
                onCheckedChange={setReadOnly}
                className="pointer-events-none"
              />
            </div>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
