import { useTheme } from "@/hooks";
import { ConfigProvider, theme } from "antd";
import { ReactNode } from "react";
interface CustomAntdThemeProps extends React.PropsWithChildren {}
const CustomAntdTheme = ({ children }: CustomAntdThemeProps) => {
  const { state } = useTheme();
  let themeConfig = [];
  if (state.darkMode) themeConfig.push(theme.darkAlgorithm);
  if (state.compact) themeConfig.push(theme.compactAlgorithm);
  return (
    <ConfigProvider
      theme={{
        algorithm: themeConfig,
        token: {
          // Seed Token
          //   colorPrimary: "#35b96b",
          borderRadius: 6,
          fontFamily:
            "Montserrat, Poppins, Segoe UI, Garet, Codec, -apple-system, BlinkMacSystemFont, sans-serif",
          // Alias Token
          fontWeightStrong: 600,
        },
      }}
    >
      {/* Class name dark to be applied to tailwind css */}
      <div className={state.darkMode ? "dark" : ""}>{children}</div>
    </ConfigProvider>
  );
};

export default CustomAntdTheme;
