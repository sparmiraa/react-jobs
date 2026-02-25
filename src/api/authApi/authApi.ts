import { publicInstance } from "../axios";
import {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./authTypes";

export const authApi = {
  login: (data: LoginRequestDto) => publicInstance.post("/auth/login", data),

  registerCandidate: (data: RegisterRequestDto) =>
    publicInstance.post("/auth/registration/candidate", data),

  registerEmployer: (data: RegisterRequestDto) =>
    publicInstance.post("/auth/registration/employer", data),

  forgotPassword: (data: ForgotPasswordDto) =>
    publicInstance.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordDto) =>
    publicInstance.post("/auth/reset-password", data),
};
