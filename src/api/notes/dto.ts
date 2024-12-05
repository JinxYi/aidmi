import { Notes } from "@/domain";
import { ClincianClientDto } from "../clinician/dto";

export interface NotesDto extends Notes {
    clinicians: ClincianClientDto;
}
