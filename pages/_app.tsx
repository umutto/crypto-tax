import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import "../utils/font-awesome";

function App({ Component, pageProps }: AppProps) {
  console.log(pageProps.session);
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default App;
