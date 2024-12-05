import { Documents } from "@/domain";
import { supabaseClient } from "@/api/supabase-client";

export const DocumentsApi = {
  async getPatientDocuments(patient_id: number): Promise<Documents[]> {
    const { data, error } = await supabaseClient
      .from("documents")
      .select("*")
      .eq("patient_id", patient_id);
    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data as Documents[];
  },
  async addPatientDocuments(
    patient_id: number,
    name: string,
    url: string,
  ): Promise<Documents> {
    const { data, error } = await supabaseClient
      .from("documents")
      .insert({
        patient_id,
        name,
        url,
      }).select();
    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data[0] as Documents;
  },
  async deletePatientDocument(document_id: number): Promise<void> {
    const { error } = await supabaseClient
      .from("documents")
      .delete()
      .eq("id", document_id);

    if (error) throw error;
  },
};
