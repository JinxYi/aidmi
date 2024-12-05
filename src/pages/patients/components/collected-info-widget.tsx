import SimpleList from "@/components/simple-list";
import { CategorisedInfo, CollectedInfo, Patient } from "@/domain";
import { capitalize } from "@/utils/pipes";
import { Descriptions, DescriptionsProps, Flex, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
interface CollectedInfoWidgetProps {
  patient: Patient;
  collectedInfo: CategorisedInfo;
}
const CollectedInfoWidget = ({
  patient,
  collectedInfo,
}: CollectedInfoWidgetProps) => {
  const [personalInfo, setPersonalInfo] = useState<string[]>([]);
  const [family, setFamily] = useState<string[]>([]);
  const [medical, setMedical] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [psychosocial, setPsychosocial] = useState<string[]>([]);

  useEffect(() => {
    setPersonalInfo(JSON.parse(collectedInfo.personal.content));
    setFamily(JSON.parse(collectedInfo.family.content));
    setMedical(JSON.parse(collectedInfo.medical_history.content));
    setLifestyle(JSON.parse(collectedInfo.lifestyle.content));
    setPsychosocial(JSON.parse(collectedInfo.psychosocial.content));
  }, []);

  const personalData: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Age",
      children: patient ? patient?.age : "-",
    },
    {
      key: "2",
      label: "Gender",
      children: patient?.gender ? capitalize(patient?.gender) : "-",
    },
    {
      key: "3",
      label: "Last Education",
      children: patient?.last_education
        ? capitalize(patient?.last_education)
        : "-",
    },
    {
      key: "4",
      label: "Marital Status",
      children: patient?.marriage_status
        ? capitalize(patient?.marriage_status)
        : "-",
    },
    {
      key: "5",
      label: "Job",
      children: patient?.job ? capitalize(patient?.job) : "-",
    },
  ];

  const summary: TabsProps["items"] = [
    {
      key: "info-personal",
      label: "Personal",
      children: (
        <Flex vertical>
          {personalData && <Descriptions size="small" items={personalData} />}
          {/* {personalInfo && personalInfo.length != 0 ? (
            personalInfo.map((info, index) => <Text key={index}>{info}</Text>)
          ) : (
            <EmptyPlaceholder />
          )} */}
        </Flex>
      ),
    },
    {
      key: "info-family",
      label: "Family",
      children: (
        <Flex vertical>
          <SimpleList data={family} />
        </Flex>
      ),
    },
    {
      key: "info-medical",
      label: "Medical History",
      children: (
        <Flex vertical>
          <SimpleList data={medical} />
        </Flex>
      ),
    },
    {
      key: "info-lifestyle",
      label: "Lifestyle",
      children: (
        <Flex vertical>
          <SimpleList data={lifestyle} />
        </Flex>
      ),
    },
    {
      key: "info-psychosocial",
      label: "Psychosocial",
      children: (
        <Flex vertical>
          <SimpleList data={psychosocial} />
        </Flex>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={summary} />;
};

export default CollectedInfoWidget;
