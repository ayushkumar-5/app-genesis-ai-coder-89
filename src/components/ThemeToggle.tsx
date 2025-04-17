
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") as "light" | "dark" || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="transition-all duration-200"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-all duration-200" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-200" />
      )}
    </Button>
  );
}
