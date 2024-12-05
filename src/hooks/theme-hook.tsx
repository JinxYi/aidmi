import { createContext, useContext } from "react";

export type ThemeConfig = {
  darkMode: boolean;
  compact: boolean;
};

export type ThemeConfigInterface = {
  state: ThemeConfig;
  dispatch: React.Dispatch<{
    type: string;
    payload?: ThemeConfig;
  }>;
};

export const ThemeContext = createContext<ThemeConfigInterface>({
  state: { darkMode: false, compact: false },
  dispatch: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme() must be used within a ThemeProvider");
  }
  return context;
};
