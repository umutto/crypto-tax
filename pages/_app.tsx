import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { AuthGuard } from "../components";

import "../styles/globals.scss";
import "../utils/font-awesome";

export default function App({ Component, pageProps }: any) {
  return (
    <Provider session={pageProps.session}>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}
