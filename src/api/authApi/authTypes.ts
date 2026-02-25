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
