export interface Diagnosis {
    id?: number;
    created_at?: Date;
    patient_id: number;
    consult_id: number;
    type: string;
    meets_criteria: boolean;
    criteria_details: any;
    average_confidence: number;
    assessment_tool: string;
    assessment_score: number;
    assessment_details: any;
    severity: string;
    panic_attacks: any;
    score: number;
}

export interface CatergorisedDiagnosis {
    [key: string]: Diagnosis
}