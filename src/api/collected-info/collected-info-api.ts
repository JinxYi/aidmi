import { supabaseClient } from "@/api/supabase-client";
import {
  CategorisedInfo,
  CollectedInfo,
  Consultation,
  MessageHighlights,
} from "@/domain";
import { transformSummaryDto } from "./transform";
import { ConsultationSummaryInterface } from "../ai/dto";

export const CollectedInfoApi = {
  async getRecentConsultationSummary(
    patientId: number,
  ): Promise<
    { consultation: Consultation | null; collectedInfo: CategorisedInfo | null }
  > {
    const { data: summary, error } = await supabaseClient
      .from("consultations")
      .select("*, collected_info(*)")
      .eq("patient_id", patientId)
      .or("status.eq.summary_created,status.eq.diagnosis_created")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    if (!summary) throw new Error("No information collected yet");
    if (summary.length == 0) return { consultation: null, collectedInfo: null };
    return transformSummaryDto(summary[0]);
  },
  async saveSummary(
    consult_id: number,
    response: ConsultationSummaryInterface,
  ): Promise<void> {
    let summaryPoints: CollectedInfo[] = [];
    let messageHighlights: MessageHighlights[] = [];
    try {
      if (!response || !response.summary) throw new Error("Invalid response");

      Object.entries(response.summary).forEach(([key, value]) => {
        summaryPoints.push({
          category: key,
          content: value,
          consult_id: consult_id,
        });
      });
      const { data: consult, error } = await supabaseClient
        .from("collected_info")
        .insert(summaryPoints);
      if (error) throw error;

      Object.entries(response.grouped_messages).forEach(([key, value]) => {
        value.forEach((element: { content: string }) => {
          messageHighlights.push({
            category: key,
            content: element.content,
            consult_id: consult_id,
          });
        });
      });
      const { data: messageResponse, error: messageError } =
        await supabaseClient
          .from("message_highlights")
          .insert(messageHighlights);
      if (messageError) throw messageError;
    } catch (error) {
      console.error("Error sending response to AI service:", error);
      throw error;
    }
  },
};
