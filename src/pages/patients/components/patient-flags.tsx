import TagsList from "@/components/tags-list-editor";
import { Flags, Patient } from "@/domain";
import { FlagsApi } from "@/api/flags/flags-api";
import { useNotification } from "@refinedev/core";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

type PatientFlagsProps = {
  patient: Patient;
};
const PatientFlags = ({ patient }: PatientFlagsProps) => {
  const { open, close } = useNotification();
  const [flags, setFlags] = useState<Flags[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlags() {
      try {
        setLoading(true);
        if (!patient || !patient.id) throw new Error("Patient is not found");
        console.log("patient", patient);
        const flagsData = await FlagsApi.getPatientFlags(patient.id);
        setFlags(flagsData);
      } catch (err) {
        open?.({
          type: "error",
          message: "Could not fetch patient flags",
          description: "An error occured while trying to get patient flags.",
          key: "flags-notification-key",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchFlags();
  }, []);
  return (
    <Skeleton active loading={loading} paragraph={false}>
      {patient && <TagsList data={flags} patient={patient}></TagsList>}
    </Skeleton>
  );
};

export default PatientFlags;
