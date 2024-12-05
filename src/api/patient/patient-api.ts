import { supabaseClient } from "@/api/supabase-client";
import { Patient } from "@/domain";
import { PatientDto } from "./dto";
import { patientDtoToPatient } from "./transform";

export const PatientApi = {
  async getPatientByClientId(clientId: string): Promise<Patient> {
    const { data, error } = await supabaseClient
      .from("patients")
      .select("*, clients(*)")
      .eq("client_id", clientId)
      .single();
    if (error) throw error;
    return patientDtoToPatient(data) as Patient;
  },
  async updateUser(updates: Partial<Patient>) {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        data: {
          user_metadata: {
            first_name: updates.first_name,
            last_name: updates.last_name,
            age: updates.age,
            gender: updates.gender,
          },
        },
      });

      if (error) throw error;

      const userId = data.user.id;
      const { data: clientData, error: clientError } = await supabaseClient
        .from("clients")
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
        })
        .eq("id", userId)
        .select();
      if (clientError) throw clientError;

      const { data: patientData, error: patientError } = await supabaseClient
        .from("patients")
        .update({
          age: updates.age,
          gender: updates.gender,
          last_education: updates.last_education,
          marriage_status: updates.marriage_status,
          job: updates.job,
        })
        .eq("client_id", userId)
        .select();
      if (patientError) throw clientError;
      return patientData;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
