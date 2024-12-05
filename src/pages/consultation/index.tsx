import MessageBubble from "@/components/message-bubble";
import TypingIndicator from "@/components/typing-indicator";
import { initialMessageMetaData } from "@/constants";
import { Consultation, Patient } from "@/domain";
import { Message, MessageMetaData } from "@/domain/Message";
import { AIApi } from "@/api/ai/ai-api";
import { ConsultationApi } from "@/api/consultation/consultation-api";
import { MessageApi } from "@/api/message/message-api";
import { SendOutlined } from "@ant-design/icons";
import { useGetIdentity, useNotification } from "@refinedev/core";
import { Button, Flex, Input } from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
const { TextArea } = Input;

const ConsultationPage = () => {
  const { open } = useNotification();
  const [isNew, setIsNew] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { data: user } = useGetIdentity<Patient>();
  const [consultation, setConsultation] = useState<Consultation>();

  const [userInput, setUserInput] = useState(""); // Add a state to store the user's input

  // Add chat as a dependency to message scroll
  useLayoutEffect(() => {
    const chatWrapper = document.querySelector(".chat-wrapper");
    if (chatWrapper) {
      chatWrapper.scrollTop = chatWrapper.scrollHeight;
    }
  }, [consultation]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let consultation: Consultation | undefined;
      let isNew: boolean | undefined;
      if (user && user.id) {
        const result = await ConsultationApi.getConsultation(user);
        if (result) {
          [consultation, isNew] = result;
          setIsNew(isNew);
        }
        setConsultation(consultation);
      }
    }
    fetchData().finally(() => setIsMounted(true));
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Send the message
      handleSubmit();
    }
  };

  const addMessage = (newMessage: Message) => {
    setConsultation((prevChat: Consultation | undefined) => {
      if (prevChat) {
        return {
          ...prevChat,
          messages: [...prevChat.messages, ...[newMessage]],
        };
      } else {
        return {
          messages: [newMessage],
          id: undefined,
          username: undefined,
          patient_id: 0,
          created_at: undefined,
        };
      }
    });
  };

  const latestMessageMetaData = () => {
    let messageMetaData = initialMessageMetaData;
    if (!consultation || !consultation.messages) return messageMetaData;
    const latestAssistantMessage = consultation.messages?.findLast(
      (message) => {
        return message.role === "assistant";
      }
    );
    if (latestAssistantMessage) {
      delete latestAssistantMessage.id;
      delete latestAssistantMessage.created_at;
      return latestAssistantMessage as MessageMetaData;
    }
    return messageMetaData;
  };

  const handleSubmit = async () => {
    if (userInput.trim() !== "" && !isAiLoading) {
      const metaData = latestMessageMetaData();
      console.log("latest assistant message", metaData);
      const newMessage: Message = {
        ...metaData,
        role: "user",
        content: userInput,
        created_at: new Date(Date.now()),
      };

      try {
        setIsAiLoading(true);
        setUserInput(""); // Clear the input field
        // update message to UI first
        addMessage(newMessage);
        if (consultation == null || consultation.id == null)
          throw new Error("Consultation not found");

        if (!user) throw new Error("Not a valid user");
        await MessageApi.sendMessages(consultation.id, newMessage);

        const messages = await MessageApi.getConsultationMessages(user);
        if (!messages) throw new Error("Failed to retrieve messages");

        const [data, id] = messages;
        if (!data) throw new Error("Could not retrieve messages");
        const aiResponse = await AIApi.getAiResponse(data);
        if (!aiResponse)
          throw new Error("Could not retrieve AI response");

        await MessageApi.sendMessages(
          consultation.id,
          aiResponse,
          "assistant"
        );
        addMessage({ ...aiResponse, role: "assistant" });
      } catch (e) {
        console.log("Could not send response " + e);
        open?.({
          type: "error",
          message: "An error occured when saving response",
          key: "end-consult-notification-key",
        });
      } finally {
        setIsAiLoading(false);
      }
    }
  };
  //   Thank you for asking. Lately, I've been feeling quite overwhelmed and anxious, especially with everything going on at work. I’ve noticed I’m having trouble sleeping, and I often wake up feeling exhausted.

  // I also feel more irritable than usual and have a hard time focusing on tasks. It’s been tough to manage these feelings, and I’m not sure why they’re happening, but I’d really like to understand what’s going on and how I can feel better.

  return (
    <Flex vertical className="h-full max-w-4xl mx-auto">
      <Flex
        flex="1"
        vertical
        className="content-wrapper w-full text-default overflow-y-auto"
      >
        {/* Need to use div with flex style instead of FLex, else container will not grow if no children */}
        <div className="flex flex-col grow chat-wrapper pt-3 overflow-y-auto">
          {user &&
            consultation &&
            consultation.messages?.map((message, i) => (
              <MessageBubble
                role={message.role}
                content={message.content}
                user={user}
                key={i}
              />
            ))}
          {user && isAiLoading && (
            <MessageBubble
              role={"assistant"}
              content={<TypingIndicator />}
              user={user}
            />
          )}
        </div>
        <div className="p-2 pb-0">
          <Flex gap="small" className="input-wrapper">
            <TextArea
              // maxLength={800}
              // showCount={true}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoSize={{ minRows: 1, maxRows: 6 }}
              className="p-4 border border-gray-300 rounded-lg"
              placeholder="These days I've been..."
            />
            <Button
              className="rounded-2xl"
              type="primary"
              icon={<SendOutlined />}
              iconPosition="end"
              onClick={handleSubmit}
              disabled={isAiLoading}
            />
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
};

export default ConsultationPage;
