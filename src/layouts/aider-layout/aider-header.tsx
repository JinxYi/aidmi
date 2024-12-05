import Small from "@/components/small";
import Avatar from "@/components/user-avatar";
import { Clinician } from "@/domain";

import { capitalize } from "@/utils/pipes";
import { useGetIdentity } from "@refinedev/core";
import { Flex, Layout, Typography, theme } from "antd";
const { Header } = Layout;
const { Text } = Typography;

const AiderHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: user } = useGetIdentity<Clinician>();
  // Safely destructure the user and profile from the data if it exists

  const getUserName = (user: Clinician) => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "Unknown User";
  };

  return (
    <Header
      className="flex justify-end items-center"
      style={{ justifyContent: "flex-end", backgroundColor: colorBgContainer }}
    >
      <Flex gap="middle" align="center">
        <Flex vertical align="end" justify="end">
          <Text className="font-medium">
            {user && getUserName(user)}
          </Text>
          {user && user.occupation && (
            <Small className="text-xs">
              {capitalize(user.occupation)}
            </Small>
          )}
        </Flex>
        {user && <Avatar display_name={getUserName(user)} />}
      </Flex>
    </Header>
  );
};

export default AiderHeader;
