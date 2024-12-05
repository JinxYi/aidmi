import { Clinician, Notes } from "@/domain";
import { supabaseClient } from "@/api/supabase-client";
import { notesDtoToNotes } from "./transform";
export interface NotesWithClinician {
  notes: Notes;
  clinician: Clinician;
}
export const NotesApi = {
  async addNoteToPatient(note: Notes): Promise<NotesWithClinician> {
    const { data, error } = await supabaseClient
      .from("notes")
      .insert(note)
      .select("*, clinicians(*, clients(*))");
    if (error) throw error;
    return notesDtoToNotes(data)[0];
  },
  async getPatientNotes(patientId: number): Promise<NotesWithClinician[]> {
    const { data, error } = await supabaseClient
      .from("notes")
      .select("*, clinicians(*, clients(*))")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (!data) throw new Error("No notes found");
    return notesDtoToNotes(data);
  },
};
