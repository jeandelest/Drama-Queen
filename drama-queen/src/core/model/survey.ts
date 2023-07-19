import type { LunaticSource } from "@inseefr/lunatic/lib/src/use-lunatic/type-source";

/**
 * We dont provide zod schema for this type because Survey are very large
 *  and validate large json is obviously very slow
 */
export type Survey = LunaticSource;
