import { ThemeToggle } from "@/components/common";

export const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-sans">
            FlatNotebook
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            Seus documentos
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
