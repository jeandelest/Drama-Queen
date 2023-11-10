import { Oidc } from "core/ports/Oidc";
import { createOidc as createOidcSpa } from "oidc-spa";

export async function createOidc(params: {
  issuerUri: string;
  clientId: string;
  publicUrl: string;
}): Promise<Oidc> {
  const { issuerUri, clientId, publicUrl } = params;

  return createOidcSpa({
    issuerUri,
    clientId,
    publicUrl,
  });
}
