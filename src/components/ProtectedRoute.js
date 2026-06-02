import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ka from "../i18n/ka";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020d0c] text-emerald-400 font-bold">
        {ka.auth.loading}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
