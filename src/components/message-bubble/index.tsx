import Typewriter from "@/components/typewriter";
import Avatar from "@/components/user-avatar";
import { Patient } from "@/domain";
import { DotChartOutlined, UserOutlined } from "@ant-design/icons";
import { Flex, theme } from "antd";
import { ReactNode } from "react";
import "./message-bubble.css";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string | ReactNode;
  user: Patient;
  animate?: boolean;
}
const MessageBubble = ({
  role,
  content,
  user,
  animate,
}: MessageBubbleProps) => {
  const { token } = theme.useToken();
  const isUser = role === "user";
  return (
    <Flex gap="small" className={`mx-4  ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar icon={isUser ? <UserOutlined /> : <DotChartOutlined />} />
      <Flex
        vertical
        className={`my-1 chat-message-wrapper ${role} ${
          !isUser ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-800 dark:text-white"
        } rounded-xl p-4 px-5 md:max-w-[75%] max-w-[90%]`}
      >
        <Flex vertical>
          <span className={`chat-sender font-bold `}>
            {isUser ? user.first_name + " " + user.last_name : "Aider"}
          </span>
          <span className="chat-content">
            {content ? (
              !isUser && animate ? (
                <Typewriter text={content} delay={20} />
              ) : (
                content
              )
            ) : (
              ""
            )}
          </span>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageBubble;
