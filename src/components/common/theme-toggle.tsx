import { Button } from "@/ui";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/ui";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("flatnotebook-theme") as Theme | null;
    return stored || getSystemTheme();
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("flatnotebook-theme", theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("flatnotebook-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Button
      data-round
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label="Alternar tema"
      className="shadow-xs"
    >
      <Icon
        Icon={theme === "dark" ? Sun : Moon}
        size="sm"
        strokeWidth="light"
        fill="currentColor"
      />
    </Button>
  );
};
