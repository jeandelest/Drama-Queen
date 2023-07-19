/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import { KeycloakParams } from "core/keycloakClient/Oidc";

interface ImportMetaEnv {
  readonly VITE_QUEEN_URL: string;
  readonly VITE_QUEEN_V2_URL: string;
  readonly VITE_AUTH_TYPE?: "OIDC";
  readonly VITE_QUEEN_API_URL: string;
  readonly VITE_KEYCLOAK_URL: KeycloakParams["url"];
  readonly VITE_KEYCLOAK_CLIENT_ID: KeycloakParams["clientId"];
  readonly VITE_KEYCLOAK_REALM: KeycloakParams["realm"];
  readonly VITE_KEYCLOAK_ORIGIN: KeycloakParams["origin"];

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
