
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  language: string;
  setLanguage: (language: string) => void;
  className?: string;
}

export default function LanguageToggle({ language, setLanguage, className }: LanguageToggleProps) {
  const languages = [
    { value: "kotlin", label: "Kotlin" },
    { value: "swift", label: "Swift" },
    { value: "dart", label: "Dart" },
  ];

  return (
    <div className={cn("flex space-x-1 border rounded-lg p-1 bg-muted", className)}>
      {languages.map((lang) => (
        <Button
          key={lang.value}
          variant={language === lang.value ? "default" : "ghost"}
          className={cn(
            "flex-1 text-sm h-8",
            language === lang.value ? "" : "hover:bg-background"
          )}
          onClick={() => setLanguage(lang.value)}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
