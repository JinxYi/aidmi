import { NotesApi, NotesWithClinician } from "@/api/notes/notes-api";
import Small from "@/components/small";
import Avatar from "@/components/user-avatar";
import { Clinician, Notes, Patient } from "@/domain";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useGetIdentity, useNotification } from "@refinedev/core";
import { Button, Divider, Flex, Input, List } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface PatientNotesWidgetProps {
  patient: Patient;
}
const PatientNotesWidget = ({ patient }: PatientNotesWidgetProps) => {
  // notes functions and variables
  const { data: user } = useGetIdentity<Clinician>();
  const { open, close } = useNotification();
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  let [psychNotes, setPsychNotes] = useState<NotesWithClinician[]>([]);
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    async function fetchNotes() {
      if (patient && patient.id) {
        try {
          const notesData = await NotesApi.getPatientNotes(patient.id);
          setPsychNotes(notesData);
        } catch (error) {
          console.error("Error retrieving pysch notes", error);
          open?.({
            type: "error",
            message: "Could not fetch psychiatrist notes",
            description:
              "An error occured while trying to get psychiatrist notes.",
            key: "psychiatrist-notes-notification-key",
          });
        }
      }
    }
    fetchNotes();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Send the message
      handleCreateNote();
    }
  };

  const handleCreateNote = async () => {
    try {
      if (!patient || !patient.id) throw new Error("Patient not found");
      if (!user) throw new Error("Not a valid user");
      if (userInput.trim() === "" || isNotesLoading) return;
      setIsNotesLoading(true);

      const note: Notes = {
        patient_id: patient.id,
        content: userInput,
        commentor: user.id,
        created_at: new Date(),
      };
      const newNote = await NotesApi.addNoteToPatient(note);
      setUserInput(""); // Clear the input field
      setPsychNotes((prev) => [newNote, ...prev]);
    } catch (e) {
      console.log("Could not send response " + e);
      open?.({
        type: "error",
        message: "An error occured when saving response",
        key: "end-consult-notification-key",
      });
    } finally {
      setIsNotesLoading(false);
    }
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={psychNotes}
        renderItem={(item, index) => (
          <List.Item>
            {item?.clinician && (
              <List.Item.Meta
                avatar={
                  <Avatar
                    display_name={`${item?.clinician.first_name} ${item?.clinician.last_name}`}
                  />
                }
                title={item.notes.content}
                description={
                  <>
                    <Small>{`${item?.clinician.first_name} ${item?.clinician.last_name} `}</Small>
                    ,
                    <Small className="ms-1">
                      {moment(item.notes.created_at).fromNow()}
                    </Small>
                  </>
                }
              />
            )}
          </List.Item>
        )}
      />
      <Divider className="mt-0 mb-2"></Divider>
      <div className="p-2 pb-0">
        <Flex gap="small" className="input-wrapper" align="center">
          <Input
            // maxLength={800}
            // showCount={true}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-lg"
            placeholder="Add a note"
          />
          <Button
            className="rounded-2xl"
            type="primary"
            icon={<ArrowUpOutlined />}
            shape="circle"
            size="small"
            onClick={handleCreateNote}
            disabled={isNotesLoading}
          />
        </Flex>
      </div>
    </>
  );
};

export default PatientNotesWidget;
