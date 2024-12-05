import { CategorisedInfo, CollectedInfo, Consultation } from "@/domain";
import { ConsultationSummaryDto } from "./dto";

export const transformSummaryDto = (
  dto: ConsultationSummaryDto,
): { consultation: Consultation; collectedInfo: CategorisedInfo } => {
  const { collected_info, ...consultation } = dto;
  const categorizedInfo = collected_info.reduce(
    (acc: any, current: CollectedInfo) => {
      const category = current.category;
      if (!acc[category]) {
        acc[category] = {};
      }
      acc[category] = current;
      return acc;
    },
    {}
  );
  return {
    consultation: consultation as Consultation,
    collectedInfo: categorizedInfo as CategorisedInfo,
  };
};
