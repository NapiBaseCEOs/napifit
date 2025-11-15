"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import UpdateChecker, { UpdateCheckerRef } from "./UpdateChecker";

const UpdateCheckerContext = createContext<{
  checkForUpdate: () => void;
} | null>(null);

export function useUpdateChecker() {
  const context = useContext(UpdateCheckerContext);
  if (!context) {
    throw new Error("useUpdateChecker must be used within UpdateCheckerProvider");
  }
  return context;
}

export default function UpdateCheckerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const updateCheckerRef = useRef<UpdateCheckerRef>(null);

  const checkForUpdate = () => {
    updateCheckerRef.current?.checkForUpdate();
  };

  return (
    <UpdateCheckerContext.Provider value={{ checkForUpdate }}>
      <UpdateChecker ref={updateCheckerRef} />
      {children}
    </UpdateCheckerContext.Provider>
  );
}

