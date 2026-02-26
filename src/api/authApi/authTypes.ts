export type AuthTokenResponseDto = {
  accessToken: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  password: string;
};

export type UserRole = "ADMIN" | "CANDIDATE" | "EMPLOYER";

export type MeResponseDto = {
  id: number;
  name: string;
  role: UserRole;
};

export type ForgotPasswordRequestDto = { email: string };
export type ResetPasswordRequestDto = { newPassword: string };

export type MessageResponseDto = { message: string };
