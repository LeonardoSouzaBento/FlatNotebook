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
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Logo>
            <LogoLink>
              <LogoIcon />
              <LogoTitle />
            </LogoLink>
            <LogoDescription>Seus documentos</LogoDescription>
          </Logo>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
