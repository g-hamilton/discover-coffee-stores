import { createContext, useReducer } from "react";

export const CoffeeStoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const coffeeStoreReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CoffeeStoreContextProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(coffeeStoreReducer, initialState);

  return (
    <CoffeeStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </CoffeeStoreContext.Provider>
  );
};

export default CoffeeStoreContextProvider;
