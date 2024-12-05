export interface Patient {
    id?: number;
    client_id?: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    age: number;
    gender: string;
    last_education?: string;
    marriage_status?: string;
    job?: string;
}