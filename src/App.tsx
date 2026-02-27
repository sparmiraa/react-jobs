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
import CompaniesProfilePage from "./pages/candidate/CandidateCompaniesPage/CandidateCompaniesPage";
import Vacancies from "./pages/candidate/VacanciesPage/VacanciesPage";
import CandidateApplies from "./pages/candidate/CandidateApplies/CandidateApplies";
import CandidateBase from "./pages/employer/CandidateBase/CandidateBase";
import MyVacancies from "./pages/employer/MyVacancies/MyVacancies";
import PublicLayout from "./layout/PublicLayout/PublicLayout";
import EmployerApplies from "./pages/candidate/EmployerApplies/EmployerApplies";
import CandidateProfilePage from "./pages/candidate/CandidateEditPage/CandidateProfilePage";
import EmployerEditPage from "./pages/employer/EmployerEditPage/EmployerEditPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import MyVacanciesPage from "./pages/employer/MyVacanciesPage/MyVacanciesPage";
import VacancyUpsertPage from "./pages/employer/VacancyUpsertPage/VacancyUpsertPage";
import VacanciesPage from "./pages/candidate/VacanciesPage/VacanciesPage";
import VacancyViewPage from "./pages/candidate/VacancyViewPage/VacancyViewPage";
import CompanyViewPage from "./pages/candidate/CompanyViewPage/CompanyViewPage";

function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="registration">
          <Route path="candidate" element={<CandidateRegistrationPage />} />
          <Route path="employer" element={<EmployerRegistrationPage />} />
        </Route>

        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>

      <Route path="/" element={<GetMeLayout />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route element={<RoleProtected allow={["CANDIDATE", "ADMIN"]} />}>
            <Route path="/candidate/edit" element={<CandidateProfilePage />} />
            <Route
              path="/candidate/my-applies"
              element={<CandidateApplies />}
            />
            <Route path="companies" element={<CompaniesProfilePage />} />
            <Route path="vacancies" element={<VacanciesPage />} />
            <Route path="vacancies/:id" element={<VacancyViewPage />} />
            <Route path="companies/:id" element={<CompanyViewPage />} />
          </Route>

          <Route element={<RoleProtected allow={["EMPLOYER", "ADMIN"]} />}>
            <Route path="/employer/edit" element={<EmployerEditPage />} />
            <Route path="employer/my-applies" element={<EmployerApplies />} />
            <Route path="candidate-base" element={<CandidateBase />} />
            <Route path="/employer/vacancies" element={<MyVacanciesPage />} />
            <Route
              path="/employer/vacancies/new"
              element={<VacancyUpsertPage mode="create" />}
            />
            <Route
              path="/employer/vacancies/:id/edit"
              element={<VacancyUpsertPage mode="edit" />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default App;
