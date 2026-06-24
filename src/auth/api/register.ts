import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export async function registerRequest(data: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}) {
  const response = await axios.post(`${BASE_API_URL}/auth/register/`, data);
  return response.data;
}
