import EmptyPlaceholder from "@/components/empty-placeholder";
import { List } from "antd";
import "./simple-list.css";

type SimpleListProps = {
  data?: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
};
const SimpleList = ({ data, renderItem }: SimpleListProps) => {
  return (
    <ul className="unordered-list-styles">
      {data && data.length != 0 ? (
        data.map((item, index) =>
          renderItem ? (
            renderItem(item, index)
          ) : (
            <li key={index} style={{ border: "none" }}>
              {item}
            </li>
          )
        )
      ) : (
        <EmptyPlaceholder />
      )}
    </ul>
  );
};

export default SimpleList;
