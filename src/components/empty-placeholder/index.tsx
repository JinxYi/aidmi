import { Empty, EmptyProps } from "antd";

const EmptyPlaceholder: React.FC<EmptyProps> = (props) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="No data collected yet"
      {...props}
    ></Empty>
  );
};

export default EmptyPlaceholder;
