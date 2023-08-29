import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";
import {NomenclatureSyncError} from "../../SyncError";

export const useGetNomenclatures = (
  nomenclatureIds: string[]
) => {
  const { getNomenclature } = useApiClient();
  return useQueries({
    queries: nomenclatureIds.map((id) => ({
      queryKey: ["nomenclature", id],
      queryFn: () => getNomenclature(id).catch(error => {
        throw new NomenclatureSyncError(error, id)
      }),
    })),
  });
};

export const useGetNomenclature = (idNomenclature: string) => {
  const { getNomenclature } = useApiClient();
  return useQuery({
    queryKey: ["nomenclature", idNomenclature],
    queryFn: () => getNomenclature(idNomenclature),
  });
};
