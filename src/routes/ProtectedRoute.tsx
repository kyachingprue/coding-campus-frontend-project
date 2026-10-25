import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export type AppRole = "student" | "instructor" | "admin";

export function dashboardForRole(role: AppRole) {
  return role === "admin" ? "/admin/dashboard" : role === "instructor" ? "/instructor/dashboard" : "/dashboard";
}

interface ProtectedRouteProps {
  roles?: AppRole[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const user = useAppSelector((s) => s.auth.user);
  const initialized = useAppSelector((s) => s.auth.initialized);
  const location = useLocation();

  if (!initialized) {
    return <div className="p-8 text-center text-sm text-mist">Checking your session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardForRole(user.role)} replace />;
  }
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const user = useAppSelector((s) => s.auth.user);
  const initialized = useAppSelector((s) => s.auth.initialized);

  if (!initialized) {
    return <div className="p-8 text-center text-sm text-mist">Checking your session...</div>;
  }
  if (user) {
    return <Navigate to={dashboardForRole(user.role)} replace />;
  }
  return <Outlet />;
}
