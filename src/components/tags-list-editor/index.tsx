import { Flags, Patient } from "@/domain";
import { FlagsApi } from "@/api/flags/flags-api";
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNotification } from "@refinedev/core";
import {
  Button,
  Flex,
  Input,
  InputRef,
  Popconfirm,
  Tag,
  theme,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./tags-list.css";

type TagsListProps = {
  data: Flags[];
  patient: Patient;
};
const TagsList = ({ data, patient }: TagsListProps) => {
  const { open, close } = useNotification();
  const { token } = theme.useToken();
  const [tags, setTags] = useState<Flags[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setTags(data); // Update state when props change
  }, [data]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleRemove = async (removedTag: Flags) => {
    try {
      const newTags = tags.filter((tag) => tag.content !== removedTag.content);
      if (!removedTag.id) throw new Error("Tag id is required");

      await FlagsApi.deleteFlagFromPatient(removedTag.id);
      console.log(newTags);
      setTags(newTags);
    } catch (error) {
      open?.({
        type: "error",
        message: "Could not delete patient flag",
        description: "An error occured while trying to delete patient flag.",
        key: "flags-delete-git adnotification-key",
      });
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (!patient || !patient.id)
      throw new Error("Patient is not defined");
    if (inputValue && !tags.some((tag) => tag.content === inputValue)) {
      // todo: add tags api here
      const newFlag = await FlagsApi.addFlagToPatient(
        patient.id,
        inputValue
      );

      setTags([...tags, newFlag]); // Assuming Flags has an id and content property
    }
    setInputVisible(false);
    setInputValue("");
  };

  const hideInput = () => {
    setInputVisible(false);
  };

  return (
    <Flex gap="4px 0" wrap>
      {tags.map<React.ReactNode>((tag, index) => {
        const isLongTag = tag.content.length > 20;
        const tagElem = (
          <Tag
            key={tag.id}
            // closable={true}
            icon={
              <Popconfirm
                title="Delete flag"
                description="Are you sure to delete this flag?"
                onConfirm={() => handleRemove(tag)}
                // onCancel={cancel}
                okText="Confirm"
                cancelText="Cancel"
              >
                <CloseOutlined />
              </Popconfirm>
            }
          >
            <span>
              {isLongTag ? `${tag.content.slice(0, 20)}...` : tag.content}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip
            title={tag.content}
            key={tag.content}
            overlayInnerStyle={{ fontSize: "0.7rem" }}
          >
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          //   style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          // onBlur={hideInput}
          onPressEnter={handleInputConfirm}
          prefix={
            <Tooltip
              title="Add Tag"
              key={"create-tag-tip"}
              overlayInnerStyle={{ fontSize: "0.7rem" }}
            >
              <Button
                onClick={handleInputConfirm}
                color="primary"
                size="small"
                shape="circle"
                icon={<PlusOutlined />}
                type="link"
              >
                {/* <Small>Add Tag</Small> */}
              </Button>
            </Tooltip>
          }
          suffix={
            <Tooltip
              title="Close"
              key={"create-tag-tip"}
              overlayInnerStyle={{ fontSize: "0.7rem" }}
            >
              <Button
                onClick={hideInput}
                size="small"
                shape="circle"
                type="text"
                icon={<CloseCircleOutlined />}
              />
            </Tooltip>
          }
        />
      ) : (
        <Tag
          className="add-tags-button"
          style={{ backgroundColor: token.colorBgContainer }}
          icon={<PlusOutlined />}
          onClick={showInput}
        >
          New Tag
        </Tag>
      )}
    </Flex>
  );
};

export default TagsList;
