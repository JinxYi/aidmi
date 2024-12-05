import React from "react";
import Layout, { Content } from "antd/es/layout/layout";

const PublicLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Layout>
      <Content className="h-screen">{children}</Content>
    </Layout>
  );
};

export default PublicLayout;
