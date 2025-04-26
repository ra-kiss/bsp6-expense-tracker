'use client';

import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const [entries, setEntries] = useState([]);
  const [recurringEntries, setRecurringEntries] = useState([]);

  const [savingsProjects, setSavingsProjects] = useState([]);

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

  const [mainCurrency, setMainCurrency] = useState('$ USD')

  const [categories, setCategories] = useState([
    'Groceries', 'Housing', 'Gas', 'Other'
  ]);

  return (
    <GlobalContext.Provider value={{ 
      entries, setEntries,
      recurringEntries, setRecurringEntries, 
      savingsProjects, setSavingsProjects,
      currencies, setCurrencies, 
      mainCurrency, setMainCurrency,
      categories, setCategories
       }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
