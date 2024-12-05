import DownloadableLink from "@/components/downloadable-link";
import EmptyPlaceholder from "@/components/empty-placeholder";
import { Documents, Patient } from "@/domain";
import { DocumentsApi } from "@/api/document/documents-api";
import { MediaApi } from "@/api/media/media-api";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useNotification } from "@refinedev/core";
const PatientDocumentsWidgets = ({ patient }: { patient: Patient }) => {
  const [documents, setDocuments] = useState<Documents[]>();
  const { open, close } = useNotification();

  useEffect(() => {
    async function fetchData() {
      if(!patient || !patient.id) return;
      const documents = await DocumentsApi.getPatientDocuments(
        patient.id
      );
      setDocuments(documents || []);
    }
    fetchData();
  }, [patient]);

  const deleteDocument = async (documentId: number, url: string) => {
    try {
    await MediaApi.deleteMedia([url]);
    await DocumentsApi.deletePatientDocument(documentId);
    setDocuments(prevList =>  prevList!.filter(doc => doc.id !== documentId));
    open?.({
      type: "success",
      message: "Document deleted successfully",
      key: "delete-document-success-notification-key",
    });
  } catch(error) {
    open?.({
      type: "error",
      message: "Error deleting document document",
      key: "delete-document-error-notification-key",
    });
  }
  };
  return (
    <>
      {documents && documents?.length !== 0 ? (
        <Flex vertical>
          {documents.map((document, index) => {
            return (
              <Flex align="center" justify="space-between">
                <DownloadableLink
                  key={index}
                  name={document.name}
                  url={document.url}
                  showIcon={true}
                />
                {document && document.id !== undefined && (
                  <Popconfirm
                    title="Delete document"
                    description="Are you sure to delete this document?"
                    onConfirm={() => deleteDocument(document.id!, document.url)}
                    okText="Confirm"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      shape="circle"
                      color="danger"
                      size="small"
                      variant="text"
                    />
                  </Popconfirm>
                )}
              </Flex>
            );
            // return <a href={document.url} download={true}><Text>{document.name}</Text></a>;
          })}
        </Flex>
      ) : (
        <EmptyPlaceholder />
      )}
    </>
  );
};

export default PatientDocumentsWidgets;
