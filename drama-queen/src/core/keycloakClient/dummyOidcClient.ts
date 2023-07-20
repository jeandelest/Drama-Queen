import { Oidc } from "./Oidc";

export const dummyOidcClient: Oidc.LoggedIn = {
  isUserLoggedIn: true,
  getAccessToken: () =>
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  renewToken: () => Promise.reject("Not implemented"),
};
