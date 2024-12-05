import { supabaseClient } from "@/api/supabase-client";
import { CatergorisedDiagnosis } from "@/domain/Diagnosis";
import { transformDiagnosisDto } from "./transform";

export const DiagnosisApi = {
  async getDiagnosis(
    consult_id: number,
  ): Promise<CatergorisedDiagnosis> {
    const { data, error } = await supabaseClient
      .from("diagnosis")
      .select("*")
      .eq("consult_id", consult_id);
    if (error) throw error;
    return transformDiagnosisDto(data);
  },
};
