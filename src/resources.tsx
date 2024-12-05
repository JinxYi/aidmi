import { UsergroupAddOutlined } from "@ant-design/icons";
import { ResourceProps } from "@refinedev/core";

const ResourceItems: ResourceProps[] = [
  {
    name: "patients",
    list: "/patients",
    show: "/patient/:id",
    meta: {
      icon: <UsergroupAddOutlined />,
      iconTitle: "Patients",
      label: "Patients",
    },
  },
  // {
  //     name: "clinicians",
  //     create: "/a/clinician/create/:id",
  //     list: "/a/clinician",
  //     meta: {
  //         icon: <UnorderedListOutlined />,
  //         iconTitle: "Clinicians",
  //         label:  "Clinicians",
  //     },
  // },
];

export default ResourceItems;
