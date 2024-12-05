import { initialAIMessage, initialMessageMetaData } from "@/constants";
import { Consultation, Patient } from "@/domain";
import { supabaseClient } from "@/api/supabase-client";

export const ConsultationApi = {
  async getConsultation(
    patient: Patient,
  ): Promise<[Consultation, boolean] | null> {
    try {
      if (!patient || !patient.id) {
        throw new Error("Could not get get consultation");
      }
      // get consultations from user which has not ended
      const { data, error } = await supabaseClient
        .from("consultations")
        .select("*, messages(*)")
        .eq("patient_id", patient.id)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1);

      let consult = data as Consultation[] | null;
      if (error) throw error;

      // if last consult has ended or patient has no consult history
      if (!consult || consult.length === 0) {
        const newConsult = await this.createConsultation(
          patient.id,
        );
        return [newConsult, true];
      }

      // sort message
      consult[0].messages.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      });
      return [consult[0], false];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async createConsultation(patientId: number): Promise<Consultation> {
    const { data: consult, error } = await supabaseClient
      .from("consultations")
      .insert([
        { patient_id: patientId },
      ])
      .select("*")
      .single();
    if (error) throw error;
    if (!consult) throw new Error("Consultation not created");
    const consultation = consult as Consultation;

    const { data: message, error: messageError } = await supabaseClient
      .from("messages")
      .insert([
        {
          role: "assistant",
          content: initialAIMessage,
          consult_id: consultation.id,
          ...initialMessageMetaData,
        },
      ]).select("*");
    if (messageError) throw messageError;
    if (!message) throw new Error("Message not created");
    consultation.messages = message;
    return consultation;
  },
  async endConsultation(consult_id: number): Promise<void> {
    const { data: endConsult, error } = await supabaseClient
      .from("consultations")
      .update(
        { status: "consultation_ended" },
      ).eq("id", consult_id);
    if (error) throw error;
  },
};
