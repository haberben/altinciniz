"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Açık moda geç" : "Karanlık moda geç"}
      className="relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none flex items-center px-1 shrink-0"
      style={{
        background: theme === "light" ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)",
        borderColor: theme === "light" ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.1)",
      }}
    >
      {/* Track icons */}
      <Sun size={11} className="absolute left-1.5 text-gold-primary opacity-70" />
      <Moon size={11} className="absolute right-1.5 text-gray-400 opacity-70" />

      {/* Thumb */}
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10"
        style={{
          transform: theme === "light" ? "translateX(0)" : "translateX(28px)",
          background: theme === "light"
            ? "linear-gradient(135deg, #D4AF37 0%, #f5d171 100%)"
            : "linear-gradient(135deg, #444 0%, #222 100%)",
        }}
      >
        {theme === "light" ? (
          <Sun size={10} className="text-white" />
        ) : (
          <Moon size={10} className="text-gray-300" />
        )}
      </span>
    </button>
  );
}
