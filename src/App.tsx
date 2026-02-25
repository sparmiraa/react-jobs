import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import AuthLayout from "./layout/AuthLayout/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { CandidateRegistrationPage } from "./pages/auth/CandidateRegistrationPage";
import { EmployerRegistrationPage } from "./pages/auth/EmployerRegistrationPage";
import GetMeLayout from "./layout/GetMeLayout/GetMeLayout";
import RoleProtected from "./guards/RoleProtected";
import NotFound from "./pages/NotFound/NotFound";
import CandidateProfilePage from "./pages/candidate/CandidateProfilePage/CandidateProfilePage";
import Vacancies from "./pages/candidate/Vacancies/Vacancies";
import MyApplies from "./pages/candidate/MyApplies/MyApplies";
import EmployerProfilePage from "./pages/employer/EmployerProfilePage/EmployerProfilePage";
import CandidateBase from "./pages/employer/CandidateBase/CandidateBase";
import MyVacancies from "./pages/employer/MyVacancies/MyVacancies";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="registration">
          <Route path="candidate" element={<CandidateRegistrationPage />} />
          <Route path="employer" element={<EmployerRegistrationPage />} />
        </Route>
      </Route>

      <Route path="/" element={<GetMeLayout />}>
        <Route element={<MainLayout />}>
          <Route element={<RoleProtected allow={["CANDIDATE", "ADMIN"]} />}>
            <Route
              path="candidate/profile"
              element={<CandidateProfilePage />}
            />
            <Route path="vacancies" element={<Vacancies />} />
            <Route path="my-applies" element={<MyApplies />} />
          </Route>

          <Route element={<RoleProtected allow={["EMPLOYER", "ADMIN"]} />}>
            <Route path="employer/profile" element={<EmployerProfilePage />} />
            <Route path="candidate-base" element={<CandidateBase />} />
            <Route path="my-vacancies" element={<MyVacancies />} />
          </Route>
        </Route>
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default App;
