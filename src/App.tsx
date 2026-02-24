import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import AuthLayout from "./layout/AuthLayout/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { CandidateRegistrationPage } from "./pages/auth/CandidateRegistrationPage";
import { EmployerRegistrationPage } from "./pages/auth/EmployerRegistrationPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="registration">
            <Route path="candidate" element={<CandidateRegistrationPage />} />
            <Route path="employer" element={<EmployerRegistrationPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
