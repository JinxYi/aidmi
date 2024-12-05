import EmptyPlaceholder from "@/components/empty-placeholder";
import SimpleList from "@/components/simple-list";
import { MessageHighlights } from "@/domain";
import { capitalize } from "@/utils/pipes";
import { Divider, Typography } from "antd";
const { Title } = Typography;

const MessageHighlightsWidget = ({
  data,
}: {
  data: {
    [category: string]: MessageHighlights[];
  };
}) => {
  return (
    <>
      {data ? (
        Object.entries(data).map(([key, highlights], index) => {
          return (
            <div key={index}>
              <Title level={5}>{capitalize(key)}</Title>
              <SimpleList
                data={highlights}
                renderItem={(item, index) => (
                  <li key={index}>{item.content}</li>
                )}
              />
              <Divider></Divider>
            </div>
          );
        })
      ) : (
        <EmptyPlaceholder />
      )}
    </>
  );
};

export default MessageHighlightsWidget;
