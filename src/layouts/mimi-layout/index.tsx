import React from "react";
import MimiHeader from "./mimi-header";
import MimiFooter from "./mimi-footer";
import Layout, { Content } from "antd/es/layout/layout";

const MimiLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Layout className="h-screen">
      <MimiHeader />
      <Content>{children}</Content>
      <MimiFooter />
    </Layout>
  );
};

export default MimiLayout;
