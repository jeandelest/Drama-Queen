import React, { ReactNode, type Component, useEffect } from "react";
import { useAuthContext } from "./context";

export function SecureProvider(params:
  { children: ReactNode }) {
    
  const { children } = params
  const authCtx = useAuthContext();

  useEffect(() => {
    if (authCtx.isUserLoggedIn) {
      return;
    }
    authCtx.login();
  }, []);

  return <>{children}</>
}