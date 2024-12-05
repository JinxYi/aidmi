import { Message } from "./Message";

export interface Consultation {
    id?: number;
    username?: string; // todo: remove when done migrating code
    patient_id: number;
    created_at?: Date;
    status?: string; // "in_progress" | "consultation_ended" | "summary_created" | "diagnosed"
    messages: Message[];
}