import { useQuery } from "@tanstack/react-query";
import { useGetCampaigns } from "./campaign";

const useSynchronize = () => {
  const { data: campaigns } = useGetCampaigns();
};
