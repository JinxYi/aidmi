import { Patient } from "@/domain";
import EditProfileForm from "@/pages/patients/edit";
import { useGetIdentity } from "@refinedev/core";
import { Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const UpdateProfile = () => {
  const { data: user } = useGetIdentity<Patient>();
  const navigate = useNavigate();
  const handleSuccess = () => {
    // redirect to consult page
    navigate("/consult");
  };

  return (
    <Flex vertical justify="center" align="center" className="h-screen">
      <Card className="flex">
        <Title
          level={3}
          className="flex justify-center mt-3 mb-6 text-2xl font-bold"
          style={{ color: "rgb(64, 150, 255)" }}
        >
          Update Profile
        </Title>
        <Text strong={true}>
          Before we get started, please update your profile information.
        </Text>
        {user && (
          <EditProfileForm data={user} handleSuccess={handleSuccess} />
        )}
      </Card>
    </Flex>
  );
};
export default UpdateProfile;
