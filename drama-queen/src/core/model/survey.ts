//import type { LunaticSource } from "@inseefr/lunatic/lib/src/use-lunatic/type-source";

import { LunaticSource } from "./type-source";

/**
 * We dont provide zod schema for this type because Survey are very large
 *  and validate large json is obviously very slow
 */
export type Questionnaire = LunaticSource;

/**
 * Utility type because API does not return Survey directly
 * Cause by /api/campaign/
 */
export type APIReturnedListOfSurvey = { value: LunaticSource };
