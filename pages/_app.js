import "../styles/globals.css";

import CoffeeStoreContextProvider from "../context/coffee-store-context";

function MyApp({ Component, pageProps }) {
  return (
    <CoffeeStoreContextProvider>
      <Component {...pageProps} />
    </CoffeeStoreContextProvider>
  );
}

export default MyApp;
