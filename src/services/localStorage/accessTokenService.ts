export const accessTokenService = {
  set(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  },
  remove() {
    localStorage.removeItem('accessToken');
  }
}
