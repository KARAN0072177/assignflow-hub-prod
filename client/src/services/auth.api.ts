import axios from "axios";
import type { RegisterPayload } from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const registerUser = async (payload: RegisterPayload) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/register`,
    payload
  );
  return response.data;
};