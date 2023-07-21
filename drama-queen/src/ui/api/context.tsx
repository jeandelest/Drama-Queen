import { Oidc } from "core/keycloakClient/Oidc";
import { QueenApi } from "core/queenApi/QueenApi";
import { createApiClient } from "core/queenApi/createApiClient";
import { createMockApiClient } from "core/queenApi/createMockApiClient";
import { ReactNode, createContext, useContext, useMemo, useRef } from "react";
import { useAccessToken, useAuthContext } from "ui/auth";

const context = createContext<QueenApi | undefined>(undefined);


export function useApiClient() {
  const apiClient = useContext(context);
  if (apiClient === undefined) throw new Error("This hook can not be used outside ApiClientProvider children")
  return apiClient;
}

export type ApiClientProviderProps = {
  apiUrl?: string;
  children: ReactNode;
};
export function ApiClientProvider(props: ApiClientProviderProps) {
  const { apiUrl, children } = props;

  const authCtx = useAuthContext()

  const apiClient = useMemo(() =>
    apiUrl
      ? createApiClient({
        apiUrl: apiUrl, 
        getAccessToken: () => authCtx.isUserLoggedIn ? authCtx.getAccessToken() : null
      })
      : createMockApiClient(),
    [authCtx, apiUrl]
  );


  return <context.Provider value={apiClient}>{children}</context.Provider>;
}
