import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ka from "../i18n/ka";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-study-bg text-study-accent font-bold">
        {ka.auth.loading}
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
