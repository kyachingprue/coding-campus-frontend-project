import { createContext, type Dispatch, type SetStateAction } from "react";

export type Theme = "light" | "dark" | "system";
export interface ThemeContextValue {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
