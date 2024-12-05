import Avatar from "@/components/user-avatar";
import { Patient } from "@/domain";
import { Flex, Typography } from "antd";
import moment from "moment";

const { Title, Text } = Typography;
type PersonalInfoProps = {
  patient: Patient;
  lastUpdated?: Date | undefined | null;
};
const PersonalInfo = ({ patient, lastUpdated }: PersonalInfoProps) => {
  return (
    <div>
      <Flex gap="middle" align="end" justify="space-between">
        <Flex gap="middle">
          <Avatar
            display_name={`${patient?.first_name} ${patient?.last_name}`}
          />
          <Flex vertical>
            {/* <Card bordered={false}> */}
            <Title level={5}>
              {patient?.first_name || patient?.last_name
                ? patient?.first_name + " " + patient?.last_name
                : "Unknown"}
            </Title>
            <Text>
              {patient?.age},{" "}
              {patient?.gender &&
                patient?.gender.charAt(0).toUpperCase() +
                  patient?.gender.slice(1)}
            </Text>
            {/* </Card> */}
          </Flex>
        </Flex>
        <Flex align="flex-end">
          {lastUpdated && (
            <Text>
              Report generated at:{" "}
              {moment(lastUpdated).format("MM/D/YYYY h:mm:ss A")}
            </Text>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default PersonalInfo;
