import { ConsultationApi } from "@/api/consultation/consultation-api";
import { MessageApi } from "@/api/message/message-api";
import { Patient } from "@/domain";
import { LoadingOutlined } from "@ant-design/icons";
import { useGetIdentity, useNotification } from "@refinedev/core";
import { Affix, Button, Flex, Modal, theme, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mimi-layout.css";
import ProfileMenu from "./profile-menu";
import { AIApi } from "@/api/ai/ai-api";
const { Title } = Typography;

const MimiHeader = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { open, close } = useNotification();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: user } = useGetIdentity<Patient>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleEndConsultation = async () => {
    if (!user) throw new Error("User not found");

    try {
      setIsUpdating(true);
      
      // set flag in database to be handle by crob jobs
      const messages = await MessageApi.getConsultationMessages(
        user,
        false
      );
      if (!messages) throw new Error("Could not retrieve messages");
      const [data, consult_id] = messages;
      if (!consult_id) throw new Error("Consultation not found");
      await AIApi.getConsultationSummary({consult_id: consult_id})
      await ConsultationApi.endConsultation(consult_id);
      navigate("/consult/end");
    } catch (error) {
      open?.({
        type: "error",
        message: "Failed to end session",
        key: "end-consult-notification-key",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Affix>
      <Header
        className="flex justify-center px-2"
        style={{ backgroundColor: colorBgContainer }}
      >
        <Flex
          justify="space-between"
          align="center"
          className="max-w-4xl md:m-5 md:w-[75%] w-full"
        >
          <Title level={4} style={{ margin: 0 }}>
            AidMi
          </Title>
          <Flex gap="middle" className="flex justify-stretch">
            <Button type="default" onClick={showModal}>
              End Consultation
            </Button>
            {user && <ProfileMenu patient={user} />}
            <Modal
              centered
              title="Warning: Ending Consultation"
              open={isModalOpen}
              onOk={handleEndConsultation}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                  disabled={isUpdating}
                  key="submit"
                  type="primary"
                  onClick={handleEndConsultation}
                  icon={isUpdating && <LoadingOutlined />}
                >
                  Confirm
                </Button>,
              ]}
            >
              <p>
                Are you certain you want to end this consultation session? Once
                ended, <strong>the conversation cannot be resumed.</strong>{" "}
                However, you may start a new consultation at any time.
              </p>
            </Modal>
          </Flex>
        </Flex>
      </Header>
    </Affix>
  );
};

export default MimiHeader;
