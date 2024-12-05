import { ThemeConfig, ThemeContext } from "@/hooks";
import { ReactNode, useEffect, useReducer } from "react";

export interface ThemeProviderProps extends React.PropsWithChildren {}

const themeReducer = (
  state: ThemeConfig,
  action: { type: string; payload?: ThemeConfig }
) => {
  let newState = { darkMode: false, compact: false };

  switch (action.type) {
    case "INIT_THEME": {
      newState = action.payload
        ? action.payload
        : { darkMode: false, compact: false };
      break;
    }
    case "COMPACT_ON": {
      newState = { ...state, compact: true };
      break;
    }
    case "COMPACT_OFF": {
      newState = { ...state, compact: false };
      break;
    }
    case "DARKMODE_ON": {
      newState = { ...state, darkMode: true };
      break;
    }
    case "DARKMODE_OFF": {
      newState = { ...state, darkMode: false };
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  localStorage.setItem("theme", JSON.stringify(newState));
  return newState;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [state, dispatch] = useReducer(themeReducer, {
    darkMode: false,
    compact: false,
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      dispatch({ type: "INIT_THEME", payload: JSON.parse(storedTheme) });
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("theme", JSON.stringify(state));
  // }, [state.darkMode, state.compact]);

  const value = { state, dispatch };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
