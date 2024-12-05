import { AuthProvider } from "@refinedev/core";
import { supabaseClient } from "@/api/supabase-client";
import { Client, Clinician, Patient } from "@/domain";
import { PatientApi } from "@/api/patient/patient-api";
import { ClientApi } from "@/client/client-api";
import { ClinicianApi } from "@/api/clinician/clinician-api";

export interface UserIdentityProps {
  user: Client;
  profile: Patient | Clinician | null;
}
const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      let { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      if (!data || !data.user) {
        throw new Error("An unexpected error occurred while logging in");
      }
      let { data: clients, error: clientError } = await supabaseClient
        .from("clients")
        .select()
        .eq("id", data.user.id)
        .single();
      if (clientError) throw clientError;

      let redirectUrl: string = "/";
      if (clients.role == "patient") redirectUrl = "/consult";
      else if (clients.role == "clinician") redirectUrl = "/patients";
      return {
        success: true,
        redirectTo: redirectUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Failed to login",
          name: error.message || "Internal Server Error",
        },
      };
    }
  },
  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;
      if (!session) throw new Error("Not logged in");
      return {
        authenticated: true,
      };
    } catch (error: any) {
      return {
        authenticated: false,
        error: error || {
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
    }
  },
  getIdentity: async (): Promise<
    Patient | Clinician | null
  > => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      if (!data || !data.user) throw new Error("User not found");

      const client = await ClientApi.getById(data.user.id);
      if (!client) throw new Error("User not found");

      if (client.role == "patient") {
        const patient = await PatientApi.getPatientByClientId(data.user.id);
        if (!patient) throw new Error("User not found");
        return patient;
      } else if (client.role == "clinician") {
        const clinician = await ClinicianApi.getByClientId(data.user.id);
        if (!clinician) throw new Error("User not found");
        return clinician;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  logout: async () => {
    // Remove the user from local storage
    let { error } = await supabaseClient.auth.signOut();
    localStorage.clear();
    if (error) {
      return {
        success: false,
        error: {
          message: "Logout Error",
          name: error.message,
        },
      };
    }
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    // Handle errors by logging them and returning a generic error message
    console.error(error);
    return {
      error: {
        message: "An error occurred",
        name: "Internal Server Error",
      },
    };
  },
  register: async (
    { email, password, first_name, last_name, age, gender },
  ) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: first_name || "",
            last_name: last_name || "",
            age: age,
            gender: gender,
            role: "patient",
          },
        },
      });
      console.log("data identitues", data);
      if (error) {
        throw error;
      } else if (data && (data.user?.identities?.length == 0)) { // WARNING: supabase does not warn if email is taken! need to check for session!
        throw new Error("Email address is already taken.");
      }
      if (!data || !data.user) throw new Error("User not found!");

      return { // return to consult page
        success: true,
        redirectTo: "/profile",
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
  forgotPassword: async ({ email }) => {
    try {
      let { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
      );

      if (error) {
        throw error;
      }

      return {
        success: true,
        redirectTo: "/forgot-password/email-sent",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "An error occurred",
          name: "Internal Server Error",
        },
      };
    }
  },
};

export default authProvider;
