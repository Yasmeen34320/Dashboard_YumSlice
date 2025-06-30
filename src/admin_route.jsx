// AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Context/auth_context";

const AdminRoute = () => {
  const { authUser, role, loading } = useAuth();

  if (loading) return <div className="text-center p-5">🔄 Loading...</div>;

  if (!authUser) return <Navigate to="/login" />;

  if (role !== "admin") return <Navigate to="*" />;

  return <Outlet />; // Continue to nested routes
};

export default AdminRoute;
