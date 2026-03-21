
export const Separator = () => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span
          className="bg-background px-3 text-muted-foreground"
          style={{ fontSize: "var(--text-sm)" }}
        >
          ou
        </span>
      </div>
    </div>
  );
};