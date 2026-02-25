export const accessTokenService = {
  isExists(): boolean {
    return localStorage.getItem("accessToken") !== null;
  },
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
