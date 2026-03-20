import {
  Logo,
  LogoIcon,
  LogoLink,
  LogoTitle,
  ThemeToggle,
} from "@/components/common";
import { BooleanSetter } from "@/types/react";
import { Button, Switch, buttonVariants } from "@/ui";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  readOnly,
  setReadOnly,
}: {
  readOnly: boolean;
  setReadOnly: BooleanSetter;
}) => {
  return (
    <header
      className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm 
      shadow-xs mb-10"
    >
      <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-between">
        <Logo>
          <LogoLink>
            <LogoIcon className="text-h5" />
            <LogoTitle className="text-h6 font-semibold leading-none" />
          </LogoLink>
        </Logo>
        <div className="flex justify-end items-center gap-2">
          <Button
            asChild
            size="sm"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "flex items-center gap-2 cursor-pointer",
            )}
            onClick={() => setReadOnly((r) => !r)}
          >
            <div>
              Somente leitura
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
