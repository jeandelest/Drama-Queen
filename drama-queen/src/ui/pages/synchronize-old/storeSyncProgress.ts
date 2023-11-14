import { SyncError } from "hooks/queries/SyncError";
import { type PullData } from "hooks/usePullData";

const LOCALSTORAGE_KEY = "QUEEN_SYNC_RESULT";

type Store =
  | {
      error: boolean;
      errors: string[];
      surveyUnitsSuccess: string[];
      surveyUnitsInTempZone: string[];
    }
  | { error: "pending" };

/**
 * Store progress in the localStorage so pearl can track the sync state
 */
export const storeSyncProgress = (
  data: PullData | null = null,
  errors: SyncError[] = []
) => {
  if (data === null) {
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({ error: "pending" } satisfies Store)
    );
    return;
  }
  window.localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify({
      error: false,
      errors: errors.map((e) => e.title),
      surveyUnitsSuccess: data.surveyUnits.map((s) => s.id),
      surveyUnitsInTempZone: [],
    } satisfies Store)
  );
};
