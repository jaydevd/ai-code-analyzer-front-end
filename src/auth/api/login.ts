// login.ts

import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(
  email: string,
  password: string
) {
  const response = await axios.post(
    `${BASE_API_URL}/auth/login/`,
    {
      email,
      password,
    }
  );

  return response.data;
}
