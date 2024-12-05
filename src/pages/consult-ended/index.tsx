import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
let { Paragraph, Title } = Typography;
const ConsultationEnded = () => {
  return (
    <Flex vertical justify="center" align="center" className="h-screen">
      <Card className="max-w-md w-5/12">
        <Flex justify="center" align="center" vertical className="m-3 mb-1">
          <Flex gap="middle" justify="center" align="center" className="mb-5">
            <CheckCircleFilled className="text-green-500" />
            <Title level={5} className="text-xl font-bold">
              Your consultation has been recorded successfully
            </Title>
          </Flex>
          <Paragraph className="text-center pb-2">
            Thank you for sharing your experiences. Your insights will be
            reviewed by a mental health professional who can provide you with
            the support needed. If you have any additional thoughts or feelings
            you'd like to express, please feel free to start a consultation
            again.
          </Paragraph>
          <Link to="/">
            <Button className="rounded-xl" type="default" name="Login">
              Return to Home
            </Button>
          </Link>
        </Flex>
      </Card>
    </Flex>
  );
};

export default ConsultationEnded;
