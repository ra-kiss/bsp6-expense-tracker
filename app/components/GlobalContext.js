'use client';

import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const [entries, setEntries] = useState([]);
  const [recurringEntries, setRecurringEntries] = useState([]);

  const [savingsProjects, setSavingsProjects] = useState([]);

  const [currencies, setCurrencies] = useState([
    {
      value: 'USD',
      label: '$ USD',
    },
    {
      value: 'EUR',
      label: '€ EUR',
    },
    {
      value: 'BTC',
      label: '฿ BTC',
    },
    {
      value: 'JPY',
      label: '¥ JPY',
    },
  ]);

  const [mainCurrency, setMainCurrency] = useState('USD');

  const [budget, setBudget] = useState('100');
  const [budgetFrequency, setBudgetFrequency] = useState('monthly');

  const [categories, setCategories] = useState([
    'Groceries', 'Housing', 'Gas', 'Other'
  ]);

  const [exchangeRates, setExchangeRates] = useState({
      USD: 1,
      EUR: 0.85,
      BTC: 0.000017,
      JPY: 110.0,
  })

  const [templates, setTemplates] = useState([]);

  return (
    <GlobalContext.Provider value={{ 
      entries, setEntries,
      recurringEntries, setRecurringEntries, 
      savingsProjects, setSavingsProjects,
      currencies, setCurrencies, 
      mainCurrency, setMainCurrency,
      budget, setBudget,
      budgetFrequency, setBudgetFrequency,
      categories, setCategories,
      exchangeRates, setExchangeRates,
      templates, setTemplates
       }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
