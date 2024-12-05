export interface CollectedInfo {
    id?: number;
    created_at?: Date;
    content: string;
    consult_id: number;
    category: string;
    // category: "personal" | "family" | "medical_history" | "lifestyle" | "psychosocial"
}

export interface CategorisedInfo {
    [key: string]: CollectedInfo;
}