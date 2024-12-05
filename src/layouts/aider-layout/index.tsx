import AiderHeader from "@/layouts/aider-layout/aider-header";
import AidMiTitle from "@/layouts/aidmi-title";
import { ThemedLayoutV2 } from "@refinedev/antd";
import React from "react";
interface AiderLayoutProps extends React.PropsWithChildren {}
const AiderLayout = ({ children }: AiderLayoutProps) => {
  return (
    <ThemedLayoutV2 Title={AidMiTitle} Header={AiderHeader}>
      {children}
    </ThemedLayoutV2>
  );
};

export default AiderLayout;
