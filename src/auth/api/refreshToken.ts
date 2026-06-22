import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export async function refreshTokenRequest(refresh: string) {
  const response = await axios.post(`${BASE_API_URL}/auth/token/refresh/`, {
    refresh,
  });
  return response.data.data;
}
