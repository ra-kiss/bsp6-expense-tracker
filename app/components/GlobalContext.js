
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";
import dayjs from 'dayjs';
import fx from 'money';

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
  const [allocatedBudget, setAllocatedBudget] = useState('0');

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
      // allocatedBudget is derived each render, no need to persist
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
    // allocatedBudget is derived; no need to load
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
      // allocatedBudget is derived each render, not included
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
          // allocatedBudget will be recalculated in the effect

          // Save imported data to local storage
          saveDataToLocal(importedData);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Failed to import settings. Please ensure the file is a valid JSON.');
        }
      };
      reader.readAsText(file);
    };

    input.click(); // Open file select dialog
  };

  // Load from local storage on mount
  useEffect(() => {
    loadDataFromLocal();
  }, []);

  // Save to local storage anytime these values change
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

  // Recalculate remainingBudget (past + upcoming) and allocatedBudget (upcoming recurring) whenever relevant data changes
  useEffect(() => {
    // Helper: parse date string "D/M/YYYY" into a Date object
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    // Helper: get next recurring date string in "D/M/YYYY" format
    const getNextDate = (dateString, repeat) => {
      const date = parseDate(dateString);
      const dayjsDate = dayjs(date);
      let next;
      switch (repeat) {
        case 'day':
          next = dayjsDate.add(1, 'day');
          break;
        case 'week':
          next = dayjsDate.add(7, 'day');
          break;
        case 'month':
          next = dayjsDate.add(1, 'month');
          break;
        case 'year':
          next = dayjsDate.add(1, 'year');
          break;
        default:
          next = dayjsDate;
      }
      return `${next.date()}/${next.month() + 1}/${next.year()}`;
    };

    // Configure fx.rates so we can convert any currency to mainCurrency
    fx.rates = exchangeRates;

    // Determine period start/end based on budgetFrequency
    const today = dayjs().toDate();
    let periodStart, periodEnd;
    if (budgetFrequency === 'weekly') {
      const now = dayjs();
      const dayOfWeek = now.day(); // Sunday=0, Monday=1, ...
      const monday = now.subtract((dayOfWeek + 6) % 7, 'day');
      periodStart = monday.startOf('day').toDate();
      periodEnd = monday.add(6, 'day').endOf('day').toDate();
    } else {
      // monthly by default
      periodStart = dayjs().startOf('month').toDate();
      periodEnd = dayjs().endOf('month').toDate();
    }

    // Sum one-time entries that occurred in period up to today
    let pastSingular = entries.reduce((sum, entry) => {
      const entryDate = parseDate(entry.date);
      if (entryDate >= periodStart && entryDate <= today) {
        const rawValue = parseFloat(entry.value) || 0;
        const convertedValue = fx.convert(rawValue, {
          from: entry.currency,
          to: mainCurrency
        });
        return sum + convertedValue;
      }
      return sum;
    }, 0);

    let pastRecurring = 0;
    let upcomingRecurring = 0;

    // Iterate recurring entries to split past vs upcoming within period
    recurringEntries.forEach((recEntry) => {
      let currentDateStr = recEntry.date;
      let current = parseDate(currentDateStr);

      while (current <= periodEnd) {
        if (current >= periodStart) {
          const rawValue = parseFloat(recEntry.value) || 0;
          const convertedValue = fx.convert(rawValue, {
            from: recEntry.currency,
            to: mainCurrency
          });
          if (current <= today) {
            pastRecurring += convertedValue;
          } else {
            upcomingRecurring += convertedValue;
          }
        }
        currentDateStr = getNextDate(currentDateStr, recEntry.repeat);
        current = parseDate(currentDateStr);
      }
    });

    // Compute allocatedBudget = sum of upcomingRecurring
    setAllocatedBudget(upcomingRecurring.toString());

    // Compute remainingBudget = budget - (pastSingular + pastRecurring + upcomingRecurring)
    const budgetValue = parseFloat(budget) || 0;
    const remaining = budgetValue - (pastSingular + pastRecurring + upcomingRecurring);
    setRemainingBudget(remaining.toString());
  }, [entries, recurringEntries, exchangeRates, mainCurrency, budget, budgetFrequency]);

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
      allocatedBudget, setAllocatedBudget,
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
