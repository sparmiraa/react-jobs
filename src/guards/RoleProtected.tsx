import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../api/authApi/authTypes";
import { useAppSelector } from "../redux/store";

interface Props {
  allow: UserRole[];
}

export default function RoleProtected({ allow }: Props) {
  const role = useAppSelector((s) => s.auth.user?.role);

  if (!role || !allow.includes(role)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
