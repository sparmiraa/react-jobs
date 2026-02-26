import { publicInstance, privateInstance } from "../axios";
import {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthTokenResponseDto,
  MeResponseDto,
  ResetPasswordRequestDto,
  MessageResponseDto,
  ForgotPasswordRequestDto,
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

  forgotPassword: async (dto: ForgotPasswordRequestDto) => {
    const { data } = await publicInstance.post<MessageResponseDto>(
      "/auth/forgot-password",
      dto
    );
    return data;
  },

  resetPassword: async (requestId: string, dto: ResetPasswordRequestDto) => {
    const { data } = await publicInstance.post<MessageResponseDto>(
      `/auth/reset-password?requestId=${encodeURIComponent(requestId)}`,
      dto
    );
    return data;
  },

  getMe: async (): Promise<MeResponseDto> => {
    const response = await privateInstance.get<MeResponseDto>("/auth/me");
    return response.data;
  },
};
