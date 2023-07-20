import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Oidc } from "core/keycloakClient/Oidc";
import { createKeycloakClient } from "core/keycloakClient/createKeycloakClient";
import { dummyOidcClient } from "core/keycloakClient/dummyOidcClient";


const context = createContext<Oidc | undefined>(undefined);

export function useAuthContext() {
  const value = useContext(context);
  if (value === undefined) throw new Error("You must wrap your component inside AuthProvider");
  return value;
}

export function useAccessToken() {
  const value = useContext(context);
  if (!value?.isUserLoggedIn) return null;
  return value.getAccessToken();
}


export type AuthProviderProps = { authType?: "OIDC", children: ReactNode };

export function AuthProvider(props: AuthProviderProps) {
  const { authType, children } = props
  const [oidcClient, setOidcClient] = useState<Oidc | undefined>(() => {
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