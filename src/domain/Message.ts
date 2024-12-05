export interface MessageContent {
    id?: number;
    created_at?: Date;
    role: "user" | "assistant";
    content: string;
}

export interface MessageMetaData {
    current_stage: string;
    fulfilled_requirements: string[];
    unfulfilled_requirements: string[];
    move_next_stage: boolean;
    stage_attempts: number;
}

export interface Message extends MessageContent, MessageMetaData {}
