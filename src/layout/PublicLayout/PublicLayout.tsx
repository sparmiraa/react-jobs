import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useEffect} from "react";
import {accessTokenService} from "../../services/localStorage/accessTokenService";
import {getMeThunk} from "../../redux/user/userThunks";
import {Navigate, Outlet} from "react-router-dom";
import FullScreenLoader from "../../components/common/FullScreenLoader/FullScreenLoader";
import {page} from "../../constants/page";

export default function PublicLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    const token = accessTokenService.get();
    if (token && !user) {
      dispatch(getMeThunk());
    }
  }, [dispatch]);

  if (accessTokenService.isExists() && (status === "unknown" || status === "loading")) return <FullScreenLoader/>;
  if (accessTokenService.isExists() && (status === "unauthenticated" || status === "failed")) {
    accessTokenService.remove();
    return <Navigate to={page.home} replace/>;
  }

  return <Outlet/>;
}