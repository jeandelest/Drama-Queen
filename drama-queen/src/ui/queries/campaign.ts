import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetCampaigns = () => {
  const { getCampaigns } = useApiClient();
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });
};
