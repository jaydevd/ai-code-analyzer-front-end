import { useSelector } from "react-redux";

interface RootState {
  auth: {
    user?: {
      role?: string;
    };
  };
}

export function useIsAdmin() {
  const user = useSelector((state: RootState) => state.auth.user);
  return user?.role === "admin";
}
