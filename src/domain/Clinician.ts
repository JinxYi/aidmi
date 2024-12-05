export interface Clinician {
    id: number;
    client_id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    occupation: "therapist" | "psychiatrist" | "psychologist";
    qualification: string;
}
