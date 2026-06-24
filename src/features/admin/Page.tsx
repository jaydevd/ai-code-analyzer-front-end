import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-[#020617]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
