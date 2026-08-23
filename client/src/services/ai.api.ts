import { apiClient } from "./apiClient";

export interface EnhanceDescriptionPayload {
  title?: string;
  description?: string;
  type?: "GRADED" | "MATERIAL";
}

export interface EnhanceDescriptionResponse {
  enhancedDescription: string;
}

/**
 * Enhance or generate assignment description with OpenAI (Teachers only)
 */
export const enhanceDescriptionWithAi = async (
  payload: EnhanceDescriptionPayload
): Promise<EnhanceDescriptionResponse> => {
  const res = await apiClient.post<EnhanceDescriptionResponse>(
    "/api/ai/enhance-description",
    payload
  );
  return res.data;
};
