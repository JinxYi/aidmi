import { ClinicianApi } from "@/api/clinician/clinician-api";
import { Create, useForm } from "@refinedev/antd";
import type { FormProps } from "antd";
import { AutoComplete, Button, Flex, Form, Input, Select } from "antd";
const { Option } = Select;

const CreateClinician = () => {
  const options = [
    { value: "Medical Degree" },
    { value: "Residency Program" },
    { value: "Board Certification" },
    { value: "State Licensure" },
  ];

  const { formProps } = useForm({});
  const onFinish: FormProps<any>["onFinish"] = async (values) => {
    console.log("clinicinan values", values);
    ClinicianApi.inviteClinician(values);

    // await PatientProvider.updateUser(values);
    // const { data, error } = await supabaseClient.auth.admin.generateLink({
    //     type: 'signup',
    //     email: 'email@example.com',
    //     password: 'secret'
    //   })
  };

  return (
    <Create footerButtons={({ defaultButtons }) => <></>}>
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
          <Flex gap="small" className="mb-3">
            <Form.Item
              style={{ marginBottom: 0 }}
              name="occupation"
              label="Occupation"
              className="grow"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select occupation" allowClear>
                <Option value="therapist">Therapist</Option>
                <Option value="psychiatrist">Psychiatrist</Option>
                <Option value="psychologist">Psychologist</Option>
              </Select>
            </Form.Item>
          </Flex>
          <Form.Item
            label={"Qualification"}
            name={["qualification"]}
            className="mb-2"
            rules={[{ required: true }]}
          >
            <AutoComplete
              options={options}
              placeholder="Select or enter your qualifications"
              filterOption={(inputValue, option) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Button type="primary" className="w-full" htmlType="submit">
            Create
          </Button>
        </Flex>
      </Form>
    </Create>
  );
};

export default CreateClinician;
