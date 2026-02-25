export const accessTokenService = {
  get(): string | null {
    return localStorage.getItem("accessToken");
  },
  set(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  },
  remove() {
    localStorage.removeItem("accessToken");
  },
};
