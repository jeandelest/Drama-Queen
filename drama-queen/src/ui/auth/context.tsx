import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Oidc } from "core/keycloakClient/Oidc";
import { createKeycloakClient } from "core/keycloakClient/createKeycloakClient";


const context = createContext<Oidc | undefined | null>(undefined);

export function useAuthContext() {
  const value = useContext(context);
  if (value === undefined) throw new Error("You must wrap your component inside AuthProvider");
  return value;
}

export function useAuthToken() {
  const value = useContext(context);
  if (!value?.isUserLoggedIn) throw new Error("This hook can not be used outside Authenticated children");
  return value.getAccessToken();
}


export type AuthProviderProps = { authType?: "OIDC", children: ReactNode };

export function AuthProvider(props: AuthProviderProps) {
  const { authType, children } = props
  const [oidcClient, setOidcClient] = useState<Oidc | null>(() => {
    switch (authType) {
      case "OIDC":
        return null;
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