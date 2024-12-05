import { Clinician } from "./Clinician";

export interface Notes {
    id?: number;
    created_at?: Date;
    patient_id: number;
    content: string;
    commentor: number; // clinician ID
}