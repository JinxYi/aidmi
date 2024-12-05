import { CollectedInfo, Consultation } from "@/domain";

export interface ConsultationSummaryDto extends Consultation {
    collected_info: CollectedInfo[];
}
