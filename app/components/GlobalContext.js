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
  const [remainingBudget, setRemainingBudget] = useState('100');

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
      remainingBudget,
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
    setRemainingBudget(localData.remainingBudget || localData.budget || '100');
  };

  const exportDataToJson = () => {
    const dataToExport = {
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
      remainingBudget,
    };
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = () => {
    if (typeof window === 'undefined') return; // Prevent server-side execution

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          setEntries(importedData.entries || []);
          setRecurringEntries(importedData.recurringEntries || []);
          setSavingsProjects(importedData.savingsProjects || []);
          setCurrencies(importedData.currencies || [
            { value: 'USD', label: '$ USD' },
            { value: 'EUR', label: '€ EUR' },
            { value: 'BTC', label: '฿ BTC' },
            { value: 'JPY', label: '¥ JPY' },
          ]);
          setMainCurrency(importedData.mainCurrency || 'USD');
          setBudget(importedData.budget || '100');
          setBudgetFrequency(importedData.budgetFrequency || 'monthly');
          setCategories(importedData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
          setExchangeRates(importedData.exchangeRates || {
            USD: 1,
            EUR: 0.85,
            BTC: 0.000017,
            JPY: 110.0,
          });
          setTemplates(importedData.templates || []);
          setRemainingBudget(importedData.remainingBudget || importedData.budget || '100');

          // Save imported data to local storage
          saveLocalData(importedData);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Failed to import settings. Please ensure the file is a valid JSON.');
        }
      };
      reader.readAsText(file);
    };

    input.click(); // Open file select dialog
  };

  useEffect(() => {
    loadDataFromLocal();
  }, []);

  // Save to local anytime anything changes
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
    remainingBudget,
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
      remainingBudget, setRemainingBudget,
      saveDataToLocal,
      loadDataFromLocal,
      exportDataToJson,
      importDataFromJson,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}