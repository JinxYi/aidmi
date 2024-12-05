import { Flags } from "@/domain";
import { supabaseClient } from "@/api/supabase-client";

export const FlagsApi = {
  async getPatientFlags(patient_id: number): Promise<Flags[]> {
    const { data, error } = await supabaseClient
      .from("flags")
      .select("*")
      .eq("patient_id", patient_id);
    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data as Flags[];
  },
  async addFlagToPatient(
    patient_id: number,
    content: string,
  ): Promise<Flags> {
    const { data, error } = await supabaseClient
      .from("flags")
      .insert({
        patient_id,
        content,
      }).select();
    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data[0] as Flags;
  },
  async deleteFlagFromPatient(flag_id: number) {
    const { data, error } = await supabaseClient
      .from("flags")
      .delete()
      .eq("id", flag_id);
    if (error) throw error;
  },
};
