import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerRequest } from "../api/register";
import { loginSuccess } from "../slices/authSlice";

export default function useSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signUp = async (data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    const response = await registerRequest(data);
    const responseData = response.data;

    dispatch(
      loginSuccess({
        user: responseData.user,
        accessToken: responseData.access,
        refreshToken: responseData.refresh,
      })
    );

    navigate("/dashboard");
  };

  return signUp;
}
