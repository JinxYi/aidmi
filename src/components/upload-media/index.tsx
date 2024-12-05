import Small from "@/components/small";
import { MediaApi } from "@/api/media/media-api";
import { v4 as uuidv4 } from "uuid";
import {
  DeleteOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNotification } from "@refinedev/core";
import {
  Button,
  Flex,
  Input,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { isValidFileName } from "./file-name-validator";

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImageOutlined />;
    case "pdf":
      return <FilePdfOutlined />;
    case "doc":
    case "docx":
      return <FileWordOutlined />;
    case "xls":
    case "xlsx":
      return <FileExcelOutlined />;
    default:
      return <FileOutlined />;
  }
};

const { Title } = Typography;

type UploadMediaProps = {
  onUploadSuccess?: (filePath: string, fileName: string) => Promise<void>;
  fileDirectory?: string;
};

const UploadMedia: React.FC<UploadMediaProps> = ({
  onUploadSuccess,
  fileDirectory = "attachments",
  ...props
}) => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [editableFileNames, setEditableFileNames] = useState<{
    [key: string]: string;
  }>({});
  const [fileNameErrors, setFileNameErrors] = useState<{
    [key: string]: string;
  }>({});
  const { open, close } = useNotification();
  const [uploading, setUploading] = useState(false);

  const customRequest = async (file: UploadFile | File) => {
    try {
      const uploadFile = file as UploadFile;
      const filePath = await MediaApi.uploadMedia(fileDirectory, uploadFile);

      if (onUploadSuccess) await onUploadSuccess(filePath, uploadFile.name);
    } catch (error: any) {
      open?.({
        type: "error",
        message: error.message,
        description: "File upload failed",
        key: "file-upload-error-notification-key",
      });
    }
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const newFileList = fileList.filter((f) => f.uid != file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file: RcFile) => {
      setFileList([...fileList, file]);
      handleFileNameChange(file.uid, file.name);

      return false;
    },
    fileList,
    itemRender: (originNode, file, fileList, actions) => (
      <Flex vertical>
        <Flex align="center" gap="small">
          {getFileIcon(file.name)}
          <Input
            size="small"
            value={editableFileNames[file.uid] || file.name}
            onChange={(e) => handleFileNameChange(file.uid, e.target.value)}
          />
          <Button
            color="danger"
            variant="text"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => actions.remove()}
          ></Button>
        </Flex>
        {fileNameErrors[file.uid] && (
          <Typography.Text style={{ fontSize: "smaller" }} type="danger">
            {fileNameErrors[file.uid]}
          </Typography.Text>
        )}
      </Flex>
    ),
  };

  const handleFileNameChange = (fileUid: string, newName: string) => {
    // setEditableFileNames((prev) => ({ ...prev, [fileUid]: newName }));

    setEditableFileNames((prev) => ({ ...prev, [fileUid]: newName }));

    if (!isValidFileName(newName)) {
      setFileNameErrors((prev) => ({
        ...prev,
        [fileUid]: "Invalid file name",
      }));
    } else {
      setFileNameErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fileUid];
        return newErrors;
      });
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const file of fileList) {
        if (!isValidFileName(editableFileNames[file.uid])) {
          open?.({
            type: "error",
            message: "File name is invalid",

            description:
              "File name should contains alphabet characters, numbers, periods, and dashes only",
            key: "file-name-validation-notification-key",
          });
          return;
        }
      }
      for (const file of fileList) {
        const editedFileName = editableFileNames[file.uid] || file.name;
        const editedFile = new File([file], editedFileName, {
          type: file.type,
        });
        await customRequest(editedFile);
      }
      setFileList([]);
      setEditableFileNames({});
      setFileNameErrors({});
    } finally {
      setUploading(false);
    }
  };

  return (
    <Flex vertical gap="small">
      <Upload.Dragger {...uploadProps} {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <Title level={5} className="ant-upload-text">
          Click or drag file to this area to upload
        </Title>
        <Small className="ant-upload-hint">
          Support for a single or bulk upload. Strictly for images, pdf, excel
          and word documents.
        </Small>
      </Upload.Dragger>
      <Button
        type="primary"
        size="small"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </Flex>
  );
};

export default UploadMedia;
