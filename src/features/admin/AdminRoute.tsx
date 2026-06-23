import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RootState {
  auth: {
    user?: {
      role?: string;
    };
  };
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
