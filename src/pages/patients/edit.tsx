import { Patient } from "@/domain";
import { PatientApi } from "@/api/patient/patient-api";
import { LoadingOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, InputNumber, Select } from "antd";
import { useState } from "react";
const { Option } = Select;

type PatientFormProps = {
  data: Patient;
  handleSuccess?: () => void;
  handleError?: (error: any) => void;
};

const EditProfileForm = ({
  data,
  handleSuccess,
  handleError,
}: PatientFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { open, close } = useNotification();
  const { formProps } = useForm({});
  const onFinish: FormProps<any>["onFinish"] = async (values) => {
    try {
      setIsUpdating(true);
      await PatientApi.updateUser(values);
      open?.({
        type: "success",
        message: "Updated profile successfully",
        key: "update-profile-notification-key",
      });
      handleSuccess && handleSuccess();
    } catch (error) {
      open?.({
        type: "error",
        message: "Could not update user profile",
        description: "An error occured while trying to update user profile.",
        key: "update-profile-error-notification-key",
      });
      handleError && handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      requiredMark="optional"
      initialValues={data}
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
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Flex>
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
        <Form.Item
          label={"Last Education"}
          name={["last_education"]}
          className="mb-2"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Marital Status"}
          name={["marriage_status"]}
          className="mb-2"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Job"}
          name={["job"]}
          className="mb-2"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="mb-5">
          <Button
            type="primary"
            className="w-full"
            htmlType="submit"
            icon={isUpdating && <LoadingOutlined />}
          >
            Update
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};

export default EditProfileForm;
