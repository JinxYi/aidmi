import { Clinician } from "@/domain";
import { ClincianClientDto } from "./dto";

export const clinicianDtoToClinician = (
    data: ClincianClientDto,
): Clinician => {
    const { clients: client, ...clinician } = data;
    const transformed: Clinician = {
        id: clinician.id,
        client_id: client.id,
        avatar_url: client.avatar_url,
        first_name: client.first_name,
        last_name: client.last_name,
        occupation: clinician.occupation,
        qualification: clinician.qualification,
    };
    return transformed;
};
