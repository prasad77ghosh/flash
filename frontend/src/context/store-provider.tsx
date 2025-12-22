"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { bootstrapAuth } from "@/lib/bootstrap-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={null}
        onBeforeLift={() => {
          bootstrapAuth(store.dispatch, store.getState);
        }}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
