import { AuthPage } from "@refinedev/antd";
import { Typography } from "antd";
const { Text } = Typography;
const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{}}
      renderContent={(content: React.ReactNode) => {
        return (
          <>
            <Text className="font-bold mb-6 text-xl block text-center">
              AidMi
            </Text>
            {content}
          </>
        );
      }}
    />
  );
};
export default Login;
