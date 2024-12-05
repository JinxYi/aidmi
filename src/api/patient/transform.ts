import { Patient } from "@/domain";
import { ClientPatientDto, PatientClientDto } from "./dto";

export const patientDtoToPatient = (
  data: PatientClientDto,
): Patient => {
  const { clients: client, ...patient } = data;
  const transformed: Patient = {
    id: patient.id,
    client_id: client.id,
    avatar_url: client.avatar_url || "",
    first_name: client.first_name,
    last_name: client.last_name,
    age: patient.age,
    gender: patient.gender,
    last_education: patient.last_education,
    marriage_status: patient.marriage_status,
    job: patient.job,
  };
  return transformed;
};

export const clientPatientDtoToPatient = (data: ClientPatientDto): Patient => {
  const { patients: patient, ...client } = data;
  const transformed: Patient = {
    id: patient.id,
    client_id: client.id,
    avatar_url: client.avatar_url || "",
    first_name: client.first_name,
    last_name: client.last_name,
    age: patient.age,
    gender: patient.gender,
    last_education: patient.last_education,
    marriage_status: patient.marriage_status,
    job: patient.job,
  };
  return transformed;
};
