import { supabaseClient } from "@/api/supabase-client";
import { Client } from "@/domain";

export const ClientApi = {
  async getById(clientId: string): Promise<Client> {
    const { data, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();
    if (error) throw error;
    return data as Client;
  },
};
