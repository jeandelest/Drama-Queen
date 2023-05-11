import { fetcher } from "utils/fetcher";
import type { LunaticSource } from "./typeSurvey";

const lunaticModelVersionBreaking = "2.2.9";

const semverCompare = new Intl.Collator("en", { numeric: true }).compare;

export async function isQueenV2Survey(
  questionnaireUrl: string | null
): Promise<boolean> {
  //By default, we redirect to queen v1 app
  if (questionnaireUrl === null) return false;
  const { lunaticModelVersion } = await fetcher<LunaticSource>(
    questionnaireUrl
  );
  return semverCompare(lunaticModelVersion, lunaticModelVersionBreaking) === 1;
}
