import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ThemeConfig, Theme } from "@/types/theme";
import { THEME_PRESETS } from "@/types/theme";

interface ThemeContextValue {
  currentTheme: ThemeConfig;
  themeSlug: string;
  isDark: boolean;
  setTheme: (slug: string) => void;
  toggleDarkMode: () => void;
  applyThemeToDocument: (config: ThemeConfig, dark?: boolean) => void;
  availableThemes: Theme[];
  setAvailableThemes: (themes: Theme[]) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({ children, defaultTheme = "romantic-rose" }: ThemeProviderProps) {
  const [themeSlug, setThemeSlug] = useState(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);

  const currentTheme = THEME_PRESETS[themeSlug] || THEME_PRESETS["romantic-rose"];

  const applyThemeToDocument = useCallback((config: ThemeConfig, dark = false) => {
    const root = document.documentElement;
    const colors = dark ? config.colors.dark : config.colors.light;

    // Apply colors
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--surface", colors.surface);
    root.style.setProperty("--surface-foreground", colors.surfaceForeground);
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.border);
    root.style.setProperty("--ring", colors.primary);

    // Apply effects
    root.style.setProperty("--gradient-romantic", config.effects.gradientPrimary);
    root.style.setProperty("--gradient-soft", config.effects.gradientSoft);
    root.style.setProperty("--gradient-hero", config.effects.gradientHero);
    root.style.setProperty("--shadow-romantic", config.effects.shadowRomantic);
    root.style.setProperty("--shadow-glow", config.effects.shadowGlow);
    root.style.setProperty("--radius", config.effects.borderRadius);

    // Apply dark mode class
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply animation speed
    const speedMap = { slow: "1.5", normal: "1", fast: "0.7" };
    root.style.setProperty("--animation-speed", speedMap[config.animations.animationSpeed]);
  }, []);

  const setTheme = useCallback((slug: string) => {
    if (THEME_PRESETS[slug]) {
      setThemeSlug(slug);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyThemeToDocument(currentTheme, isDark);
  }, [currentTheme, isDark, applyThemeToDocument]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeSlug,
        isDark,
        setTheme,
        toggleDarkMode,
        applyThemeToDocument,
        availableThemes,
        setAvailableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
