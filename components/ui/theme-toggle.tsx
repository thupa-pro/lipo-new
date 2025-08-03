"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-xl glass w-[40px] h-[40px]" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl glass hover:bg-neural-50 dark:hover:bg-neural-900/50 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-neural-600 dark:text-neural-400" />
      ) : (
        <Moon className="w-5 h-5 text-neural-600 dark:text-neural-400" />
      )}
    </button>
  );
}
