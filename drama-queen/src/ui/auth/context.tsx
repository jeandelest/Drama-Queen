import { assert } from "tsafe/assert";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Oidc } from "core/keycloakClient/Oidc";
import { createKeycloakClient } from "core/keycloakClient/createKeycloakClient";


const context = createContext<Awaited<Oidc> | undefined>(undefined);

export function useAuthContext() {
  const value = useContext(context);
  assert(value != undefined, "You must wrap your component inside AuthProvider")
  return value;
}

export type AuthProviderProps = { authType?: "OIDC", children: ReactNode };

export function AuthProvider(props: AuthProviderProps) {
  const { authType, children } = props
  const [oidcClient, setOidcClient] = useState<Awaited<Oidc> | undefined>(() => {
    switch (authType) {
      case "OIDC":
        return undefined;
      default:
        return dummyOidcClient;
    }
  });

  useEffect(() => {
    if (authType !== "OIDC") {
      return;
    }
    (async () => {
      const oidcClient = await createKeycloakClient({ url: import.meta.env.VITE_KEYCLOAK_URL, clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID, realm: import.meta.env.VITE_KEYCLOAK_REALM, origin: import.meta.env.VITE_KEYCLOAK_ORIGIN })
      setOidcClient(oidcClient)
    })()
  }, []);

  if (oidcClient === undefined) return <div>Context Loading</div>
  return <context.Provider value={oidcClient}>{children}</context.Provider>

}

const dummyOidcClient: Oidc.LoggedIn = {
  isUserLoggedIn: true,
  getAccessToken: () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "renewToken": () => Promise.reject("Not implemented")
};