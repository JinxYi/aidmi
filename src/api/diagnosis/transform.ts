import { CatergorisedDiagnosis } from "@/domain";
import { DiagnosisDto } from "./dto";

export const transformDiagnosisDto = (data: DiagnosisDto[]): CatergorisedDiagnosis => {
    let categorisedDiagnosis: CatergorisedDiagnosis = {};
    data.forEach((d) => {
      categorisedDiagnosis[d.type] = d;
    });
    return categorisedDiagnosis;
}