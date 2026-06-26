import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../slices/authSlice";
import { getProfile } from "../api/getProfile";
import { updateUser } from "../slices/authSlice";

const OAuthCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    async function handleCallback() {
      if (params.has("error")) {
        const error = params.get("error");
        if (window.opener) {
          window.opener.postMessage({ type: "github-oauth-callback", error }, window.location.origin);
          window.close();
          return;
        }

        const returnPath = params.get("return_path") || "/login";
        navigate(returnPath, { replace: true, state: { oauthError: error } });
        return;
      }

      const accessToken = params.get("access");
      const refreshToken = params.get("refresh");
      const action = params.get("action");
      const returnPath = params.get("return_path") || "/dashboard";

      if (accessToken && refreshToken) {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "github-oauth-callback",
              access: accessToken,
              refresh: refreshToken,
            },
            window.location.origin
          );
          window.close();
        } else {
          dispatch(
            loginSuccess({
              user: {} as any,
              accessToken,
              refreshToken,
            })
          );

          try {
            const profile = await getProfile();
            const userData = profile.data || profile;
            dispatch(updateUser(userData));
          } catch {
            // Profile fetch failed; token state is still stored.
          }

          navigate("/dashboard", { replace: true });
        }
      } else if (action) {
        try {
          const profile = await getProfile();
          const userData = profile.data || profile;
          dispatch(updateUser(userData));
        } catch {
          // Ignore profile refresh failures and continue navigation.
        }

        navigate(returnPath, { replace: true, state: { oauthAction: action } });
      } else {
        navigate("/login", { replace: true });
      }
    }

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
