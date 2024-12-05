export interface Client {
    id: string;
    created_at: Date;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role: "patient" | "clinician" | "admin";
}