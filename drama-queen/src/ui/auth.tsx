import { ReactNode } from "react";
import { useCoreFunctions } from "core";


export function RequiresAuthentication(props:
  { children: ReactNode }) {

  const { children } = props
  const { userAuthentication } = useCoreFunctions();

  if (!userAuthentication.getIsUserLoggedIn()) {
    userAuthentication.login();
    return null;
  }

  return <>{children}</>
}