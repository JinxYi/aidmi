import { Client } from "@/domain";

export interface PatientDto {
    id: number;
    client_id: string;
    age: number;
    gender: string;
    last_education: string;
    marriage_status: string;
    job: string;
}

export interface PatientClientDto extends PatientDto {
    clients: Client;
}

export interface ClientPatientDto extends Client {
    patients: PatientDto;
}
