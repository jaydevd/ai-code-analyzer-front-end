const useGithubSignIn = () => {
  const signIn = async (intent: "login" | "link" = "login", returnPath?: string) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    if (intent === "login") {
      const params = new URLSearchParams({ intent: "login" });
      if (returnPath) params.set("return_path", returnPath);
      window.location.href = `${VITE_API_URL}/auth/github/authorize/?${params}`;
      return;
    }

    const { api } = await import("@/lib/axios");
    const response = await api.get("/auth/github/authorize/", {
      params: { intent, ...(returnPath ? { return_path: returnPath } : {}) },
    });
    const url = response.data?.data?.url;
    if (!url) {
      throw new Error("Missing GitHub authorization URL.");
    }
    window.location.href = url;
  };

  return signIn;
};

export default useGithubSignIn;
