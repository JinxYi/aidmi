import { Message, Patient } from "@/domain";
import { ConsultationApi } from "@/api/consultation/consultation-api";
import { supabaseClient } from "@/api/supabase-client";
import { ConsultationDto } from "./dto";
import { transformMessageDto } from "./transform";
import { AIMessageDto } from "../ai/dto";

export const MessageApi = {
  async sendMessages(
    consult_id: number,
    message: Message,
    role: "user" | "assistant" = "user",
  ): Promise<void> {
    const { error } = await supabaseClient
      .from("messages")
      .insert({ ...message, consult_id: consult_id, role: role });

    if (error) throw error;
  },
  async getConsultationMessages(
    patient: Patient,
    withMetaData = true,
  ): Promise<[AIMessageDto, number?] | null> {
    const consult = await ConsultationApi.getConsultation(patient);
    if(!consult) throw new Error("Consultation not found");
    const [consultation, isNew] = consult;
    if (!consult) return null;
    return transformMessageDto(consultation, patient, withMetaData);
  },
};
