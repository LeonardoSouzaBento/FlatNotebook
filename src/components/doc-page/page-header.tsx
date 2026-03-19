export const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        <span
          className="font-medium text-foreground"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-sm)",
          }}
        >
          FlatNotebook
        </span>
        <span
          className="text-muted-foreground"
          style={{ fontSize: "var(--text-xs)" }}
        >
          Salvo automaticamente
        </span>
      </div>
    </header>
  );
};
