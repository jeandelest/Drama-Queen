import { ReactNode, createContext, useContext, useMemo, useRef } from "react";
import { useGuaranteedMemo } from "hooks/tools/useGuaranteedMemo";
import { QueenApi } from "core/ports/QueenApi/QueenApi";

const context = createContext<QueenApi | undefined>(undefined);

export function useQueenApi() {
  const queenApi = useContext(context);
  if (queenApi === undefined) throw new Error("This hook can not be used outside ApiProvider children")
  return queenApi;
}


export function createQueenApiProvider(
  params: {
    apiUrl?: string;
  }
) {

  const { apiUrl } = params;

  function QueenApiProvider(props: {
    children: ReactNode;
  }) {
    const { children } = props;

    const apiClient = undefined;

    return <context.Provider value={apiClient}>{children}</context.Provider>;
  }

  return { QueenApiProvider };

}

