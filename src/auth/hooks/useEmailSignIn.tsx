// useEmailSignIn.ts

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../api/login";
import { loginSuccess } from "../slices/authSlice";

export default function useEmailSignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await loginRequest(
        email,
        password
      );
      const data= response.data;

      dispatch(
        loginSuccess({
          user: data.user,
          accessToken: data.access,
          refreshToken: data.refresh,
        })
      );

      navigate("/dashboard");

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return signIn;
}