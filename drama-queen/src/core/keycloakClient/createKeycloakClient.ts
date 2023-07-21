import type { KeycloakParams, Oidc } from "./Oidc";
import Keycloak from "keycloak-js";
import { assert } from "tsafe/assert";
import { decodeJwt } from "core/tools/jwt";
import { listenActivity } from "core/tools/listenActivity";

export async function createKeycloakClient(params: KeycloakParams) {
  const {
    url,
    realm,
    clientId,
    origin,
    log,
  } = params;

  const keycloakInstance = new Keycloak({ url, realm, clientId });

  const isAuthenticated = await keycloakInstance.init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: `${origin}/silent-sso.html`,
    checkLoginIframe: false,
  });

  const login = async () => {
    await keycloakInstance.login({ redirectUri: window.location.href });
    return new Promise<never>(() => {});
  };

  if (!isAuthenticated) {
    return {
      isUserLoggedIn: false,
      login,
    } satisfies Oidc;
  }

  assert(keycloakInstance.token !== undefined);

  let currentAccessToken = keycloakInstance.token;

  const oidc = {
    isUserLoggedIn: true,
    getAccessToken: () => currentAccessToken,
    renewToken: async () => {
      await keycloakInstance.updateToken(-1);

      assert(keycloakInstance.token !== undefined);

      currentAccessToken = keycloakInstance.token;
    },
  } satisfies Oidc;

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
