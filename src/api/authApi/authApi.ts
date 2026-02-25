import { publicInstance, privateInstance } from "../axios";
import {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthTokenResponseDto,
  MeResponseDto,
} from "./authTypes";

export const authApi = {
  login: async (data: LoginRequestDto) => {
    const responseDto = await publicInstance.post<AuthTokenResponseDto>(
      "/auth/login",
      data
    );
    return responseDto.data as AuthTokenResponseDto;
  },

  registerCandidate: async (data: RegisterRequestDto) => {
    const responseDto = await publicInstance.post<AuthTokenResponseDto>(
      "/auth/registration/candidate",
      data
    );
    return responseDto.data as AuthTokenResponseDto;
  },

  registerEmployer: async (data: RegisterRequestDto) => {
    const responseDto = await publicInstance.post<AuthTokenResponseDto>(
      "/auth/registration/employer",
      data
    );
    return responseDto.data as AuthTokenResponseDto;
  },

  forgotPassword: (data: ForgotPasswordDto) =>
    publicInstance.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordDto) =>
    publicInstance.post("/auth/reset-password", data),

  getMe: async (): Promise<MeResponseDto> => {
    const response = await privateInstance.get<MeResponseDto>("/auth/me");
    return response.data;
  },
};
