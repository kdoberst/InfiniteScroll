import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext<{
  delay: number;
  itemsPerPage: number;
  setDelay: (delay: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}>({
  delay: 1,
  itemsPerPage: 10,
  setDelay: () => {},
  setItemsPerPage: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [delay, setDelay] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  return (
    <LoadingContext.Provider value={{ delay, itemsPerPage, setDelay, setItemsPerPage }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingConfig = () => {
  return useContext(LoadingContext);
};
