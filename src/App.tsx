import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Refine } from "@refinedev/core";
import routerBindings, {
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { dataProvider } from "@refinedev/supabase";
import { App as AntdApp } from "antd";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@/context";
import authProvider from "@/providers/auth/auth-provider";
import routerResource from "@/resources";
import AppRoutes from "@/routes";
import CustomAntdTheme from "@/styles/custom-antd-theme";
import { customTitleHandler } from "@/utils/document-title";
import { supabaseClient } from "@/api/supabase-client";

function App() {
  return (
    <BrowserRouter>
      <AntdApp>
        <ThemeProvider>
          <CustomAntdTheme>
            <Refine
              dataProvider={{
                default: dataProvider(supabaseClient),
              }}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={routerResource}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "o5mU0J-xx3Ffo-Furnv2",
                title: {
                  // icon: <U />,
                  text: "AidMi",
                },
              }}
            >
              <DocumentTitleHandler handler={customTitleHandler} />
              <AppRoutes />
              {/* <UnsavedChangesNotifier /> */}
              <DocumentTitleHandler />
            </Refine>
          </CustomAntdTheme>
        </ThemeProvider>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
