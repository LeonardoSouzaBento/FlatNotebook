import {
  Logo,
  LogoDescription,
  LogoIcon,
  LogoLink,
  LogoTitle,
  ThemeToggle,
} from "@/components/common";

export const PageHeader = () => {
  return (
    <header className="shadow-sm/4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-4.5 flex items-center justify-between">
        <div>
          <Logo>
            <LogoLink className="text-h2 gap-2">
              <LogoIcon />
              <LogoTitle className="text-h6" />
            </LogoLink>
            <LogoDescription className="font-[350]">
              Seus documentos
            </LogoDescription>
          </Logo>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
