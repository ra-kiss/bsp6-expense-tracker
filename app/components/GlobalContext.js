'use client';

import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const [entries, setEntries] = useState([]);

  const [currencies, setCurrencies] = useState([
    {
      value: '$ USD',
      label: '$ USD',
    },
    {
      value: '€ EUR',
      label: '€ EUR',
    },
    {
      value: '฿ BTC',
      label: '฿ BTC',
    },
    {
      value: '¥ JPY',
      label: '¥ JPY',
    },
  ]);

  const [categories, setCategories] = useState([
    {
      value: 'Groceries',
      label: 'Groceries',
    },
    {
      value: 'Housing',
      label: 'Housing',
    },
    {
      value: 'Gas',
      label: 'Gas',
    },
    {
      value: 'Other',
      label: 'Other',
    }
  ]);

  return (
    <GlobalContext.Provider value={{ entries, setEntries, currencies, setCurrencies, categories, setCategories }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
