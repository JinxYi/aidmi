import { Flex } from "antd";
import { Footer } from "antd/es/layout/layout";
import Small from "@/components/small";


const MimiFooter = () => {
  return (
    <Footer className="p-0">
      <Flex justify="middle" className="px-3 pb-2">
        <Small className="mx-auto text-center">
          Having any issues or need immediate assistance? Contact our hotline at
          +65 6123 4592 for support. We’re here to help.
        </Small>
      </Flex>
    </Footer>
  );
};

export default MimiFooter;
