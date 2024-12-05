export interface Clinician {
    id?: number;
    email?: string;
    password?: string;
    client_id?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
    occupation: "therapist" | "psychiatrist" | "psychologist";
    qualification: string;
}