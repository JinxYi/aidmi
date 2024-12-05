import { Clinician, Notes } from "@/domain";
import { clinicianDtoToClinician } from "../clinician/transform";
import { NotesDto } from "./dto";

export const notesDtoToNotes = (
    data: NotesDto[],
): { notes: Notes; clinician: Clinician }[] => {
    return data.map(({ clinicians: clinicianDto, ...notes }) => {
        const clinician = clinicianDtoToClinician(clinicianDto);
        return { notes, clinician };
    });
};
