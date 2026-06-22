// src/routes/AppRoutes.tsx

import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

// Public Pages
import EmailLogInPage from "@/auth/pages/EmailLogInPage";
import LogInPage from "@/auth/pages/LogInPage";
import LandingPage from "@/features/landing-page/Page";

// Dashboard
import DashboardPage from "@/features/dashboard/Page";

// Profile
import ProfilePage from "@/features/user/Page";

// Not Found
import NotFoundPage from "@/shared/pages/NotFoundPage";

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

/**
 * Protected Routes
 * Redirects unauthenticated users to login
 */
function ProtectedRoute() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * Public Auth Routes
 * Prevent authenticated users from seeing login pages
 */
function PublicAuthRoute() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/**
 * Root Route
 */
function RootRoute() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state;
  const tab = state ? state.tab : null;

  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRoute />} />

      {/* Public Auth Routes */}
      <Route element={<PublicAuthRoute />}>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/login/email" element={<EmailLogInPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage tab={tab ? tab : 'home'} />} />

        {/* Repositories */}
        <Route
          path="/repositories"
          element={<div>Repositories Page</div>}
        />

        {/* Repository Details */}
        <Route
          path="/repositories/:repoId"
          element={<div>Repository Detail</div>}
        />

        {/* Branch */}
        <Route
          path="/repositories/:repoId/branches/:branchName"
          element={<div>Branch View</div>}
        />

        {/* Chat */}
        <Route
          path="/repositories/:repoId/chats/:chatId"
          element={<div>Repository Chat</div>}
        />

        {/* Profile */}
        <Route
          path="/user/profile"
          element={<ProfilePage />}
        />
      </Route>

      {/* Dedicated Not Found Route */}
      <Route path="/404" element={<NotFoundPage />} />

      {/* Catch All */}
      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}

export default AppRoutes