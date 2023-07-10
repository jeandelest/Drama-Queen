import type { KeycloakParams, Oidc } from "./Oidc";
import Keycloak from "keycloak-js";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import { decodeJwt } from "core/tools/jwt";
import { listenActivity } from "core/tools/listenActivity";

export async function createKeycloakClient(
  params: KeycloakParams
): Promise<Oidc> {
  const {
    url,
    realm,
    clientId,
    origin = window.location.origin + import.meta.env.BASE_URL,
    log,
  } = params;

  const keycloakInstance = new Keycloak({ url, realm, clientId });

  const isAuthenticated = await keycloakInstance
    .init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${origin}/silent-sso.html`,
      checkLoginIframe: false,
    })
    .catch((error: Error) => error);

  //TODO: Make sure that result is always an object.
  if (isAuthenticated instanceof Error) {
    throw isAuthenticated;
  }

  const login: Oidc.NotLoggedIn["login"] = async () => {
    await keycloakInstance.login({ redirectUri: window.location.href });
    return new Promise<never>(() => {});
  };

  if (!isAuthenticated) {
    return id<Oidc.NotLoggedIn>({
      isUserLoggedIn: false,
      login,
    });
  }

  assert(keycloakInstance.token !== undefined);

  let currentAccessToken = keycloakInstance.token;

  const oidc = id<Oidc.LoggedIn>({
    isUserLoggedIn: true,
    getAccessToken: () => currentAccessToken,
    renewToken: async () => {
      await keycloakInstance.updateToken(-1);

      assert(keycloakInstance.token !== undefined);

      currentAccessToken = keycloakInstance.token;
    },
  });

  (function callee() {
    const msBeforeExpiration =
      getAccessTokenExpirationTime(currentAccessToken) - Date.now();

    setTimeout(async () => {
      log?.(
        `OIDC access token will expire in ${minValiditySecond} seconds, waiting for user activity before renewing`
      );

      await listenActivity();

      log?.("User activity detected. Refreshing access token now");

      const error = await keycloakInstance.updateToken(-1).then(
        () => undefined,
        (error: Error) => error
      );

      if (error) {
        log?.("Can't refresh OIDC access token, getting a new one");
        //NOTE: Never resolves
        await login();
      }

      assert(keycloakInstance.token !== undefined);

      currentAccessToken = keycloakInstance.token;

      callee();
    }, msBeforeExpiration - minValiditySecond * 1000);
  })();

  return oidc;
}

const minValiditySecond = 25;

function getAccessTokenExpirationTime(accessToken: string): number {
  return decodeJwt<{ exp: number }>(accessToken)["exp"] * 1000;
}
