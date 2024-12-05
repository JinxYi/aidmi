import { Patient } from "@/domain";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  Button,
  Flex,
  Input,
  Select,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
const { Option } = Select;

const columns: TableProps<Patient>["columns"] = [
  {
    title: "Name",
    dataIndex: "full_name",
    key: "full_name",
    render: (_, patient: Patient) =>
      `${
        patient?.first_name || patient?.last_name
          ? patient?.first_name + " " + patient?.last_name
          : "-"
      }`,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (data: string) =>
      data && data.charAt(0).toUpperCase() + data.slice(1),
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    onFilter: (value, record) => record.gender === value,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    filters: [
      { text: "0-18", value: "0-18" },
      { text: "19-35", value: "19-35" },
      { text: "36-50", value: "36-50" },
      { text: "51+", value: "51+" },
    ],
    onFilter: (value, record) => {
      const age = record.age;
      if (value === "0-18") return age >= 0 && age <= 18;
      if (value === "19-35") return age >= 19 && age <= 35;
      if (value === "36-50") return age >= 36 && age <= 50;
      if (value === "51+") return age >= 51;
      return true;
    },
  },
  {
    title: "Joined On",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => new Date(date).toDateString(),
  },
];

const PatientList: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  useDocumentTitle("Patients | AidMi");
  const navigate = useNavigate();
  //   const { data, isLoading } = useList();
  const {
    tableQuery,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    pageCount,
    setFilters,
    filters,
    sorters,
  } = useTable<any, HttpError>({
    resource: "clients",
    filters: {
      initial: [
        {
          field: "role",
          operator: "contains",
          value: "patient",
        },
      ],
    },
    meta: {
      select:
        "id, created_at, first_name, last_name, avatar_url, patients(gender, age)",
    },
    pagination: {
      mode: "client", // limit pagination to be handle by client, not server
    },
  });
  const data = tableQuery?.data?.data ?? [];
  const patients: Patient[] = data.map((item, id) => ({
    key: id,
    ...item.patients,
    ...item,
  }));

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany<
  //   Patient,
  //   HttpError
  // >({
  //   resource: "patients",
  //   // Creates the array of ids. This will filter and fetch the category data for the relevant posts.
  //   ids: patients.map((item) => item?.?.id),
  //   queryOptions: {
  //     // Set to true only if the posts array is not empty.
  //     enabled: !!posts.length,
  //   },
  // });

  // Checks if there is a next page available
  const hasNext = current < pageCount;
  // Checks if there is a previous page available
  const hasPrev = current > 1;
  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilters([
      {
        operator: "or",
        value: [
          {
            field: "first_name",
            operator: "contains",
            value,
          },
          {
            field: "last_name",
            operator: "contains",
            value,
          },
        ],
      },
    ]); // Apply search on both first_name and last_name
  };

  const handleRowClick = (record: Patient) => {
    navigate(`/patient/${record.id}`); // Navigate to the patient details page
  };
  if (tableQuery?.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {/* <Flex justify="flex-end">

      </Flex> */}
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <Input.Search
              placeholder="Search by name"
              allowClear
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
            {/* <Button type="default">Filter</Button> */}
          </>
        )}
      >
        <Table
          columns={columns}
          dataSource={patients}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record), // Click event handler
            };
          }}
        />
      </List>

      {/* Pagination */}
      <Flex gap="middle" justify="flex-end" align="center" className="my-3">
        <div>
          <Button
            className="p-1 text-xs"
            type="text"
            onClick={() => setCurrent(1)}
            disabled={!hasPrev}
          >
            <DoubleLeftOutlined />
          </Button>
          <Button
            className="p-1 text-xs"
            type="text"
            onClick={() => setCurrent((prev) => prev - 1)}
            disabled={!hasPrev}
          >
            <LeftOutlined />
          </Button>
          <Button
            className="p-1 text-xs"
            type="text"
            onClick={() => setCurrent((prev) => prev + 1)}
            disabled={!hasNext}
          >
            <RightOutlined />
          </Button>
          <Button
            className="p-1 text-xs"
            type="text"
            onClick={() => setCurrent(pageCount)}
            disabled={!hasNext}
          >
            <DoubleRightOutlined />
          </Button>
        </div>
        <Flex>
          Page
          <Text className="font-bold ml-1">
            {current} of {pageCount}
          </Text>
        </Flex>
        <Space>
          Go to Page:
          <Input
            type="number"
            defaultValue={current}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 1;
              setCurrent(value);
            }}
          />
        </Space>
        <Select
          value={pageSize}
          onChange={(value) => {
            const pageValue = value ? Number(value) : 10;
            setPageSize(pageValue);
          }}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <Option key={size} value={size}>
              Show {size}
            </Option>
          ))}
        </Select>
      </Flex>
    </div>
  );
};

export default PatientList;
