import { useQueries, useQuery } from "@tanstack/react-query";
//TODO Remove import from core
import { LunaticSource } from "core/model/type-source";
import { useApiClient } from "ui/api/context";

export const useGetNomenclatures = (
  suggesters: LunaticSource["suggesters"]
) => {
  const suggesterArray = suggesters ?? [];
  const { getNomenclature } = useApiClient();
  return useQueries({
    queries: suggesterArray.map(({ name }) => ({
      queryKey: ["nomenclature", name],
      queryFn: () => getNomenclature(name),
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
