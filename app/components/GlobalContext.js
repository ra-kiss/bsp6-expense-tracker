'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  console.log('GlobalProvider rendering, isServer:', typeof window === 'undefined');

  const [localData, saveLocalData] = useLocalStorage("localData", null);

  const [entries, setEntries] = useState([]);
  const [recurringEntries, setRecurringEntries] = useState([]);
  const [savingsProjects, setSavingsProjects] = useState([]);
  const [currencies, setCurrencies] = useState([
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'BTC', label: '฿ BTC' },
    { value: 'JPY', label: '¥ JPY' },
  ]);
  const [mainCurrency, setMainCurrency] = useState('USD');
  const [budget, setBudget] = useState('100');
  const [budgetFrequency, setBudgetFrequency] = useState('monthly');
  const [categories, setCategories] = useState(['Groceries', 'Housing', 'Gas', 'Other']);
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 0.85,
    BTC: 0.000017,
    JPY: 110.0,
  });
  const [templates, setTemplates] = useState([]);

  const saveDataToLocal = () => {
    const dataToSave = {
      entries,
      recurringEntries,
      savingsProjects,
      currencies,
      mainCurrency,
      budget,
      budgetFrequency,
      categories,
      exchangeRates,
      templates,
    };
    saveLocalData(dataToSave);
  };

  const loadDataFromLocal = () => {
    if (!localData) return;

    setEntries(localData.entries || []);
    setRecurringEntries(localData.recurringEntries || []);
    setSavingsProjects(localData.savingsProjects || []);
    setCurrencies(localData.currencies || [
      { value: 'USD', label: '$ USD' },
      { value: 'EUR', label: '€ EUR' },
      { value: 'BTC', label: '฿ BTC' },
      { value: 'JPY', label: '¥ JPY' },
      { value: 'AAA', label: 'a AAA'},
    ]);
    setMainCurrency(localData.mainCurrency || 'USD');
    setBudget(localData.budget || '100');
    setBudgetFrequency(localData.budgetFrequency || 'monthly');
    setCategories(localData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
    setExchangeRates(localData.exchangeRates || {
      USD: 1,
      EUR: 0.85,
      BTC: 0.000017,
      JPY: 110.0,
    });
    setTemplates(localData.templates || []);
  };

  useEffect(() => {
    loadDataFromLocal();
  }, []);

  useEffect(() => {
    saveDataToLocal();
  }, [
    entries,
    recurringEntries,
    savingsProjects,
    currencies,
    mainCurrency,
    budget,
    budgetFrequency,
    categories,
    exchangeRates,
    templates,
  ]);  

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
      templates, setTemplates,
      saveDataToLocal,
      loadDataFromLocal,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
