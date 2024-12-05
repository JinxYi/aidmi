import { Client } from "@/domain";

export interface ClinicianDto {
    id: number;
    client_id: string;
    qualification: string;
    occupation: "therapist" | "psychiatrist" | "psychologist";
}

export interface ClincianClientDto extends ClinicianDto {
    clients: Client;
}

export interface UpdateEmailType {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    occupation: string;
    qualification: string;
}
