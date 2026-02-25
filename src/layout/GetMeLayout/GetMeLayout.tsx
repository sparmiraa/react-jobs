import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { accessTokenService } from "../../services/localStorage/accessTokenService";
import { useEffect } from "react";
import { getMeThunk } from "../../redux/user/userThunks";
import FullScreenLoader from "../../components/common/FullScreenLoader/FullScreenLoader";

export default function GetMeLayout() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    const token = accessTokenService.get();
    if (!token) return;

    if (status === "unknown") {
      dispatch(getMeThunk());
    }
  }, [dispatch, status]);

  const token = accessTokenService.get();

  if (!token) return <Navigate to="/not-found" replace />;

  if (status === "unknown" || status === "loading") {
    return <FullScreenLoader />;
  }

  if (status === "unauthenticated" || status === "failed") {
    accessTokenService.remove();
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
