import React, { ReactNode, type Component, useEffect } from "react";
import { useAuthContext } from "./context";

export function Authenticated(props:
  { children: ReactNode }) {

  const { children } = props
  const authCtx = useAuthContext();

  useEffect(() => {
    if (authCtx?.isUserLoggedIn) {
      return;
    }
    authCtx?.login();
  }, [authCtx]);

  if (!authCtx?.isUserLoggedIn) return null;

  return <>{children}</>
}