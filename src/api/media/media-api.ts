import { supabaseClient } from "@/api/supabase-client";

export const storageName = "aidmi_client_docs";
export const MediaApi = {
  async uploadMedia(fileDirectory: string, fileBuffer: any): Promise<string> {
    const fileName = fileDirectory + "/" + fileBuffer.name;
    const { data, error } = await supabaseClient
      .storage
      .from(storageName)
      .upload(fileName, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    if (!data) throw new Error("Could not upload media");
    return data.path;
  },
  async downloadMedia(media_url: string): Promise<Blob> {
    const { data, error } = await supabaseClient
      .storage
      .from(storageName)
      .download(media_url);

    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data;
  },
  async deleteMedia(media_urls: string[]): Promise<void> {
    const { data, error } = await supabaseClient
      .storage
      .from(storageName)
      .remove(media_urls);

    if (error) throw error;
    if (!data) throw new Error("Failed to delete media");
  },
};
