import { Card, Flex, Typography } from "antd";
import RegisterForm from "./components/register-form";
let { Text, Title } = Typography;

const Register = () => {
  return (
    <Flex vertical justify="center" align="center" className="h-screen">
      <Text className="font-bold mb-6 text-xl">AidMi</Text>
      <Card className="flex">
        <Title
          level={3}
          className="flex justify-center mt-3 mb-6 text-2xl font-bold"
          style={{ color: "rgb(64, 150, 255)" }}
        >
          Create New Account
        </Title>
        <RegisterForm />
      </Card>
    </Flex>
  );
};

export default Register;
