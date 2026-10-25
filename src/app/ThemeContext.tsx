import { useEffect, useState, type PropsWithChildren } from "react";
import { ThemeContext, type Theme } from "./theme-context";

const STORAGE_KEY = "coding-campus-theme";
const THEMES: Theme[] = ["light", "dark", "system"];
function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(savedTheme as Theme) ? savedTheme as Theme : "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
