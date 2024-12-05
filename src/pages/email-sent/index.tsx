import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
let { Text, Paragraph } = Typography;
export const ForgetPasswordEmailSent = () => {
  return (
    <Flex vertical justify="center" align="center" className="h-screen">
      <Card className="max-w-md w-5/12">
        <Flex justify="center" align="center" vertical className="m-3 mb-1">
          <Flex gap="middle" justify="center" align="center" className="mb-5">
            <CheckCircleFilled className="text-green-500" />
            <Text className="text-xl font-bold">
              Forget Password Email Sent
            </Text>
          </Flex>
          <Paragraph className="text-center pb-2">
            An email has been sent to you. To reset you password, please follow
            the instructions in the email.
          </Paragraph>
          <Link to="/login">
            <Button className="rounded-xl" type="default" name="Login">
              Return to Login
            </Button>
          </Link>
        </Flex>
      </Card>
    </Flex>
  );
};

export default ForgetPasswordEmailSent;
