import { Message, Patient } from "@/domain";

// interface for AI response to user message
export interface AIResponseDto {
    response?: Message;
}

// interface for sending messages to AI
export interface AIMessageDto {
    user_data: PatientMetaData;
    messages: Message[];
}

interface PatientMetaData extends Patient {
    username?: string;
}

export interface Summary {
    personal: string[];
    family: string[];
    medical_history: string[];
    lifestyle: string[];
    psychosocial: string[];
  }
  
  export interface GroupedMessages {
    personal: GroupedMessageContent[];
    family: GroupedMessageContent[];
    medical_history: GroupedMessageContent[];
    lifestyle: GroupedMessageContent[];
    psychosocial: GroupedMessageContent[];
  }
  
  export interface GroupedMessageContent {
    content: string;
  }
  
  // interface for AI summary of conultation
  export interface ConsultationSummaryInterface {
    username: string;
    summary: Summary;
    grouped_messages: GroupedMessages;
  }
  
  