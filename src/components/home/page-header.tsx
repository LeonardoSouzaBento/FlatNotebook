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
    <header className="shadow-sm/7">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Logo>
            <LogoLink className="text-h2 mb-1 gap-2">
              <LogoIcon />
              <LogoTitle className="text-h6 leading-none" />
            </LogoLink>
            <LogoDescription className="font-[350]">Seus documentos</LogoDescription>
          </Logo>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
