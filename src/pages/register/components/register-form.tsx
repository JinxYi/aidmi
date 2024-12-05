import { useForm } from "@refinedev/antd";
import { useRegister } from "@refinedev/core";
import type { FormProps } from "antd";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
const { Option } = Select;
const { Text } = Typography;

type RegisterVariables = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
};
const RegisterForm = () => {
  const { formProps } = useForm();
  const { mutate: register } = useRegister<RegisterVariables>();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    setIsLoading(true);

    register(values, {
      onSuccess: () => {
        // login(values);
        setIsLoading(false);
      },
    });
  };

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      requiredMark="optional"
    >
      <Flex vertical>
        <Flex className="mb-3">
          <Form.Item
            label={["First Name"]}
            name={["first_name"]}
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "Please enter your first name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={["Last Name"]}
            name={["last_name"]}
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginBottom: 0,
              marginLeft: "8px",
            }}
            rules={[
              {
                required: true,
                message: "Please enter your last name",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Flex>
        <Form.Item
          label={"Email"}
          name={["email"]}
          className="mb-3"
          rules={[
            {
              type: "email",
              message: "The input is not valid email!",
            },
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          className="mb-3"
          rules={[
            {
              required: true,
            },
            {
              min: 8,
              message: "Password must be at least 8 characters long!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Flex gap="small" className="mb-4">
          <Form.Item
            style={{ marginBottom: 0 }}
            name="gender"
            label="Gender"
            className="grow"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Gender" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={"Age"}
            name={["age"]}
            className="mb-2"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
        </Flex>
        <Form.Item className="mb-5">
          <Button
            type="primary"
            className="w-full"
            htmlType="submit"
            loading={isLoading}
          >
            Sign Up
          </Button>
        </Form.Item>
        <Text className="text-xs flex self-center mb-3">
          Already have an account?{" "}
          <Link to="/login" className="ml-1 font-bold">
            Login
          </Link>
        </Text>
      </Flex>
    </Form>
  );
};

export default RegisterForm;
