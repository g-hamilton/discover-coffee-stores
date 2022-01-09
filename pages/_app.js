import { createContext } from "react";

import "../styles/globals.css";

const coffeeStoreContext = createContext();

const CoffeeStoreContextProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };
  return (
    <coffeeStoreContext.Provider value={{ state: initialState }}>
      {children}
    </coffeeStoreContext.Provider>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <CoffeeStoreContextProvider>
      <Component {...pageProps} />
    </CoffeeStoreContextProvider>
  );
}

export default MyApp;
