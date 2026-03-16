const PERSIST_ROOT = "persist:root";

export const localStoreTokenService = {
  clearAll() {
    localStorage.removeItem(PERSIST_ROOT);
  },

  getAccessToken() {
    const auth = localStorage.getItem(PERSIST_ROOT);
    if (auth) {
      const authParsed = JSON.parse(auth);
      const authData = JSON.parse(authParsed.auth);
      return authData.token;
    }
  },

  setAccessToken(accessToken: string) {
    const auth = localStorage.getItem(PERSIST_ROOT);
    if (auth) {
      const authParsed = JSON.parse(auth);
      const authData = JSON.parse(authParsed.auth);
      authData.token = accessToken;
      authParsed.auth = JSON.stringify(authData);
      const savedData = JSON.stringify(authParsed);
      localStorage.setItem(PERSIST_ROOT, savedData);
    }
  },
};
