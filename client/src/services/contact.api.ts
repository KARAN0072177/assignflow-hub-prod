import { apiClient } from "./apiClient";
import type { ContactPayload } from "../types/contact.types";

/**
 * Submit contact form
 * POST /api/contact/submit
 */
export const submitContactForm = async (payload: ContactPayload) => {
  const response = await apiClient.post("/api/contact/submit", payload);
  return response.data;
};