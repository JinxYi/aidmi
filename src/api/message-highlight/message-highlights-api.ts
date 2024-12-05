import { MessageHighlights } from "@/domain";
import { supabaseClient } from "@/api/supabase-client";

export const MessageHighlightsApi = {
  async getHighlights(
    consult_id: number,
  ): Promise<MessageHighlights[]> {
    const { data: messageResponse, error: messageError } = await supabaseClient
      .from("message_highlights")
      .select("*")
      .eq("consult_id", consult_id);
    if (messageError) throw messageError;
    return messageResponse as MessageHighlights[];
  },
};
