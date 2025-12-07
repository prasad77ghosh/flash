/* eslint-disable react-hooks/refs */
"use client";
import { useState, useRef } from "react";
import { Provider } from 'react-redux';
import { makeStore, AppStore } from "../store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const [store, setStore] = useState<AppStore | null>(null);

  if (!store && !storeRef.current) {
    storeRef.current = makeStore();
    setStore(storeRef.current);
  }

  if (!store) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
}
