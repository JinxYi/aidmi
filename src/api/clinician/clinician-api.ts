import { supabaseClient } from "@/api/supabase-client";
import { Clinician } from "@/domain";
import { clinicianDtoToClinician } from "./transform";
import { UpdateEmailType } from "./dto";

export const ClinicianApi = {
  async getByClientId(id: string): Promise<Clinician> {
    const { data, error: clinicianError } = await supabaseClient
      .from("clinicians")
      .select("*, clients(*)")
      .eq("client_id", id)
      .single();
    if (clinicianError) throw clinicianError;
    return clinicianDtoToClinician(data) as Clinician;
  },
  async inviteClinician(
    { email, password, first_name, last_name, occupation, qualification }:
      UpdateEmailType,
  ) {
    if (!email || !password) throw new Error("Email and password are required");
    try {
      const { data, error } = await supabaseClient.auth.admin.generateLink({
        type: "signup",
        email: email,
        password: password,
        options: {
          data: {
            first_name: first_name || "",
            last_name: last_name || "",
            occupation: occupation,
            qualification: qualification,
            role: "clinician",
          },
        },
      });

      if (error) throw error;
      if (!data || !data.user) throw new Error("User not found!");

      return {
        success: true,
        redirectTo: "/a/clinician",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Failed to create user",
          name: error.message || "Internal Server Error",
        },
      };
    }
  },
};
