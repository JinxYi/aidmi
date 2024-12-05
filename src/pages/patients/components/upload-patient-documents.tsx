import UploadMedia from "@/components/upload-media";
import { Patient } from "@/domain";
import { DocumentsApi } from "@/api/document/documents-api";
import { useNotification } from "@refinedev/core";

type PatientDocumentProps = {
  patient: Patient;
};

const UploadPatientDocuments = ({ patient }: PatientDocumentProps) => {
  const { open, close } = useNotification();
  const saveDocument = async (filePath: string, fileName: string) => {
    try {
      if (!patient || !patient.id) throw new Error("Patient is required");
      // const fileName = filePath.split("/").pop();
      await DocumentsApi.addPatientDocuments(
        patient.id,
        fileName || filePath,
        filePath
      );
      open?.({
        type: "success",
        message: "Document saved successfully",
        key: "save-document-success-notification-key",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Could not save document",
        description: "An error occured while trying to save document.",
        key: "save-document-error-notification-key",
      });
    }
  };
  return <UploadMedia fileDirectory={"attachments/"+patient.client_id} onUploadSuccess={saveDocument}></UploadMedia>;
};

export default UploadPatientDocuments;
