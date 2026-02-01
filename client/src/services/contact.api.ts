import axios from "axios";
import type { ContactPayload } from "../types/contact.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Submit contact form
 * POST /api/contact/submit
 */
export const submitContactForm = async (
  payload: ContactPayload
) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/contact/submit`,
    payload
  );

  return response.data;
};