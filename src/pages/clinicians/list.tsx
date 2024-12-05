import { Clinician } from "@/domain";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
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

const columns: TableProps<Clinician>["columns"] = [
  {
    title: "Name",
    dataIndex: "full_name",
    key: "full_name",
    render: (_, record: Clinician) =>
      `${record.first_name} ${record.last_name}`,
  },
  {
    title: "Occupation",
    dataIndex: "occupation",
    key: "occupation",
    render: (data: string) =>
      data && data.charAt(0).toUpperCase() + data.slice(1),
    filters: [
      { text: "Therapist", value: "therapist" },
      { text: "Psychiatrist", value: "psychiatrist" },
      { text: "Psychologist", value: "psychologist" },
    ],
    onFilter: (value, record) => record.occupation === value,
  },
  {
    title: "Qualification",
    dataIndex: "qualification",
    key: "qualification",
  },
  {
    title: "Joined On",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => new Date(date).toDateString(),
  },
];

const ClinicianList: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
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
    meta: {
      select:
        "id, created_at, first_name, last_name, avatar_url, clinicians(qualification, occupation)",
    },
    filters: {
      initial: [
        {
          field: "role",
          operator: "contains",
          value: "clinician",
        },
      ],
    },
    pagination: {
      mode: "client", // limit pagination to be handle by client, not server
    },
  });
  const data = tableQuery?.data?.data ?? [];
  const clinician: Clinician[] = data.map((item, id) => ({
    key: id,
    ...item.clinician,
    ...item,
  }));

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

  const handleRowClick = (record: Clinician) => {
    // navigate(`/a/clinician/${record.id}`); // Navigate to the clinician details page
  };
  if (tableQuery?.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {/* {defaultButtons} */}
            <Input.Search
              placeholder="Search by name"
              allowClear
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </>
        )}
      >
        <Table
          columns={columns}
          dataSource={clinician}
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
            defaultValue={current + 1}
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

export default ClinicianList;
