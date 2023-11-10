import { createCoreProvider } from "core";
import { RequiresAuthentication } from "ui/auth";
import { LoadingData } from "ui/pages/LoadingData";


const { CoreProvider } = createCoreProvider({
  "apiUrl": import.meta.env.VITE_API_URL,
  "publicUrl": import.meta.env.BASE_URL,
  "oidcParams": {
    "issuerUri": import.meta.env.VITE_OIDC_ISSUER,
    "clientId": import.meta.env.VITE_OIDC_CLIENT_ID,
  },
});

export default function App() {
  console.log("public", import.meta.env.BASE_URL)
  return (
    /*
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <QueenApiProvider>
            <RouterProvider router={router} />
          </QueenApiProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      */
    <CoreProvider fallback={<h1>Loading</h1>} >
      <RequiresAuthentication>
        <LoadingData />
      </RequiresAuthentication>
    </CoreProvider>)
}