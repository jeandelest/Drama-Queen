import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Oidc } from "core/keycloakClient/Oidc";
import { createKeycloakClient } from "core/keycloakClient/createKeycloakClient";
import { dummyOidcClient } from "core/keycloakClient/dummyOidcClient";
import { useQuery } from "@tanstack/react-query";


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

export type AuthProviderProps = { authType?: "OIDC", keycloakUrl: string, clientId: string, realm: string, origin?: string, children: ReactNode };

let prOidcClient: Promise<Oidc> | undefined = undefined

export function AuthProvider(props: AuthProviderProps) {
  const { authType, keycloakUrl, clientId, realm, origin = window.location.origin + import.meta.env.BASE_URL, children } = props

  const { data: oidcClient, isLoading } = useQuery({
    queryKey: ["keycloak-client", authType, keycloakUrl, realm, origin],
    queryFn: () => {
      switch (authType) {
        case "OIDC":
          return createKeycloakClient({ url: keycloakUrl, clientId, realm, origin });
        default:
          return dummyOidcClient;
      }
    }
  });

  if (isLoading) return <div>Context Loading</div>
  return <context.Provider value={oidcClient}>{children}</context.Provider>

}