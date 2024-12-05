import AidMiTitle from "@/layouts/aidmi-title";
import { ThemedLayoutV2 } from "@refinedev/antd";
import React from "react";

const AiderLayout = ({ children }: React.PropsWithChildren) => {
  return <ThemedLayoutV2 Title={AidMiTitle}>{children}</ThemedLayoutV2>;
};

export default AiderLayout;
