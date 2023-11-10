import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.string(),
  questionnaireIds: z.string().array(),
});

export type Campaign = z.infer<typeof CampaignSchema>;
