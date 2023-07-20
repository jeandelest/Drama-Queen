import { QueenApi } from "core/queenApi/QueenApi";
import { createApiClient } from "core/queenApi/createApiClient";
import { createMockApiClient } from "core/queenApi/createMockApiClient";
import { ReactNode, createContext, useContext, useRef } from "react";
import { useAccessToken } from "ui/auth";

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

  const accessToken = useAccessToken()

  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken

  const apiClient = apiUrl
    ? createApiClient({ apiUrl: apiUrl, getAccessToken: () => accessTokenRef.current })
    : createMockApiClient();

  return <context.Provider value={apiClient}>{children}</context.Provider>;
}
