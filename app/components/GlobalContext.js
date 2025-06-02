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
  const [currencies, setCurrencies] = useState([]); // Initialize empty, populate with filtered currencies
  const [mainCurrency, setMainCurrency] = useState('USD');
  const [budget, setBudget] = useState('100');
  const [budgetFrequency, setBudgetFrequency] = useState('monthly');
  const [categories, setCategories] = useState(['Groceries', 'Housing', 'Gas', 'Other']);
  const [exchangeRates, setExchangeRates] = useState({}); // Initialize empty, populate with filtered rates
  const [templates, setTemplates] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState('100');
  const [allocatedBudget, setAllocatedBudget] = useState('0');
  const [lastRatesUpdate, setLastRatesUpdate] = useState(null); // Track last update time

  // Replace with your ExchangeRate-API key
  const API_KEY = '5e353c9666b3c058c7ceeab6';

  // Define currency symbols mapping
  const currencySymbols = {
    USD: '$ USD',
    EUR: '€ EUR',
    BTC: '₿ BTC',
    JPY: '¥ JPY',
    GBP: '£ GBP',
    AUD: '$ AUD',
    CAD: '$ CAD',
    CHF: '₣ CHF',
    CNY: '¥ CNY',
  };

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
      lastRatesUpdate,
    };
    saveLocalData(dataToSave);
  };

  const loadDataFromLocal = () => {
    if (!localData) return;

    setEntries(localData.entries || []);
    setRecurringEntries(localData.recurringEntries || []);
    setSavingsProjects(localData.savingsProjects || []);
    setCurrencies(localData.currencies || []);
    setMainCurrency(localData.mainCurrency || 'USD');
    setBudget(localData.budget || '100');
    setBudgetFrequency(localData.budgetFrequency || 'monthly');
    setCategories(localData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
    setExchangeRates(localData.exchangeRates || {});
    setTemplates(localData.templates || []);
    setRemainingBudget(localData.remainingBudget || localData.budget || '100');
    setLastRatesUpdate(localData.lastRatesUpdate || null);
  };

  const exportDataToJson = () => {
    const dataToExport = {
      entries,
      recurringEntries,
      savingsProjects,
      currencies,
      mainCurrency創新者,
      budget,
      budgetFrequency,
      categories,
      exchangeRates,
      templates,
      remainingBudget,
      lastRatesUpdate,
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
    if (typeof window === 'undefined') return;

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
          setCurrencies(importedData.currencies || []);
          setMainCurrency(importedData.mainCurrency || 'USD');
          setBudget(importedData.budget || '100');
          setBudgetFrequency(importedData.budgetFrequency || 'monthly');
          setCategories(importedData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
          setExchangeRates(importedData.exchangeRates || {});
          setTemplates(importedData.templates || []);
          setRemainingBudget(importedData.remainingBudget || importedData.budget || '100');
          setLastRatesUpdate(importedData.lastRatesUpdate || null);
          saveDataToLocal();
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Failed to import settings. Please ensure the file is a valid JSON.');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Fetch exchange rates and currencies from ExchangeRate-API
  const fetchExchangeRates = async (baseCurrency, forceFetch = false) => {
    if (typeof window === 'undefined') return;

    // Check if rates were updated recently (within 24 hours for free tier)
    if (!forceFetch && lastRatesUpdate) {
      const lastUpdate = dayjs(lastRatesUpdate);
      const now = dayjs();
      if (now.diff(lastUpdate, 'hour') < 24) {
        console.log('Using cached exchange rates');
        return;
      }
    }

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
      );
      const data = await response.json();
      if (data.result === 'success') {
        // Filter rates to include only currencies with defined symbols
        const newRates = {};
        Object.keys(currencySymbols).forEach((code) => {
          if (data.conversion_rates[code]) {
            newRates[code] = data.conversion_rates[code];
          }
        });
        setExchangeRates(newRates);
        setLastRatesUpdate(dayjs().toISOString());

        // Update fx library with new rates
        fx.base = baseCurrency;
        fx.rates = newRates;

        // Populate currencies with only supported codes from symbol mapping
        const newCurrencies = Object.keys(currencySymbols).map((code) => ({
          value: code,
          label: currencySymbols[code],
        }));
        setCurrencies(newCurrencies);
      } else {
        console.error('API error:', data['error-type']);
        alert('Failed to fetch exchange rates. Using cached rates or defaults.');
        // Fallback to default currencies if API fails
        if (Object.keys(exchangeRates).length === 0) {
          const defaultCurrencies = Object.keys(currencySymbols).map((code) => ({
            value: code,
            label: currencySymbols[code],
          }));
          setCurrencies(defaultCurrencies);
          setExchangeRates({
            USD: 1,
            EUR: 0.85,
            BTC: 0.000017,
            JPY: 110.0,
            GBP: 0.79,
            AUD: 1.35,
            CAD: 1.27,
            CHF: 0.91,
            CNY: 6.47,
          });
          fx.base = baseCurrency;
          fx.rates = {
            USD: 1,
            EUR: 0.85,
            BTC: 0.000017,
            JPY: 110.0,
            GBP: 0.79,
            AUD: 1.35,
            CAD: 1.27,
            CHF: 0.91,
            CNY: 6.47,
          };
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      alert('Failed to fetch exchange rates. Using cached rates or defaults.');
      // Fallback to default currencies if API fails
      if (Object.keys(exchangeRates).length === 0) {
        const defaultCurrencies = Object.keys(currencySymbols).map((code) => ({
          value: code,
          label: currencySymbols[code],
        }));
        setCurrencies(defaultCurrencies);
        setExchangeRates({
          USD: 1,
          EUR: 0.85,
          BTC: 0.000017,
          JPY: 110.0,
          GBP: 0.79,
          AUD: 1.35,
          CAD: 1.27,
          CHF: 0.91,
          CNY: 6.47,
        });
        fx.base = baseCurrency;
        fx.rates = {
          USD: 1,
          EUR: 0.85,
          BTC: 0.000017,
          JPY: 110.0,
          GBP: 0.79,
          AUD: 1.35,
          CAD: 1.27,
          CHF: 0.91,
          CNY: 6.47,
        };
      }
    }
  };

  // Load from local storage and fetch rates on mount
  useEffect(() => {
    loadDataFromLocal();
    fetchExchangeRates(mainCurrency);
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
    lastRatesUpdate,
  ]);

  // Update fx configuration whenever exchangeRates or mainCurrency changes
  useEffect(() => {
    fx.base = mainCurrency;
    fx.rates = exchangeRates;
  }, [exchangeRates, mainCurrency]);

  // Fetch new rates when mainCurrency changes
  useEffect(() => {
    setLastRatesUpdate(null); // Reset to force fetch
    fetchExchangeRates(mainCurrency, true); // Force fetch new rates
  }, [mainCurrency]);

  // Allocate remaining budget to savings goals at the end of the budget period
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndAllocateBudget = () => {
      const now = dayjs();
      let isEndOfPeriod = false;
      let periodEnd;

      // Determine if it's the end of the budget period
      if (budgetFrequency === 'weekly') {
        periodEnd = now.endOf('week');
        isEndOfPeriod = now.isSame(periodEnd, 'day');
      } else {
        periodEnd = now.endOf('month');
        isEndOfPeriod = now.isSame(periodEnd, 'day');
      }

      if (!isEndOfPeriod) return;

      // Get incomplete savings projects (value < goal)
      const incompleteProjects = savingsProjects.filter(
        (project) => parseFloat(project.value) < parseFloat(project.goal)
      );

      if (incompleteProjects.length === 0 || parseFloat(remainingBudget) <= 0) return;

      let remainingFunds = parseFloat(remainingBudget);
      const updatedProjects = [...savingsProjects];

      // Allocate funds sequentially to incomplete projects
      for (let i = 0; i < updatedProjects.length && remainingFunds > 0; i++) {
        const project = updatedProjects[i];
        const currentValue = parseFloat(project.value) || 0;
        const goal = parseFloat(project.goal) || 0;

        if (currentValue >= goal) continue; // Skip completed projects

        // Calculate remaining amount needed in project's currency
        const remainingNeeded = goal - currentValue;
        // Convert to mainCurrency for allocation
        const remainingNeededInMainCurrency = fx.convert(remainingNeeded, {
          from: project.currency,
          to: mainCurrency,
        });

        // Determine how much to allocate
        const amountToAllocateInMainCurrency = Math.min(remainingFunds, remainingNeededInMainCurrency);
        const amountToAllocateInProjectCurrency = fx.convert(amountToAllocateInMainCurrency, {
          from: mainCurrency,
          to: project.currency,
        });

        // Update project value
        updatedProjects[i] = {
          ...project,
          value: (currentValue + amountToAllocateInProjectCurrency).toFixed(2).toString(),
        };

        // Update remaining funds
        remainingFunds -= amountToAllocateInMainCurrency;
      }

      // Update state
      setSavingsProjects(updatedProjects);
      setRemainingBudget(remainingFunds.toFixed(2).toString());
      setBudget(budget); // Reset budget for the new period
    };

    // Check daily at midnight
    const interval = setInterval(checkAndAllocateBudget, 24 * 60 * 60 * 1000); // 24 hours
    checkAndAllocateBudget(); // Run immediately in case we're already at the end

    return () => clearInterval(interval); // Cleanup on unmount
  }, [savingsProjects, remainingBudget, budgetFrequency, exchangeRates, mainCurrency, budget]);

  // Recalculate remainingBudget and allocatedBudget
  useEffect(() => {
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

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

    const today = dayjs().toDate();
    let periodStart, periodEnd;
    if (budgetFrequency === 'weekly') {
      const now = dayjs();
      const dayOfWeek = now.day();
      const monday = now.subtract((dayOfWeek + 6) % 7, 'day');
      periodStart = monday.startOf('day').toDate();
      periodEnd = monday.add(6, 'day').endOf('day').toDate();
    } else {
      periodStart = dayjs().startOf('month').toDate();
      periodEnd = dayjs().endOf('month').toDate();
    }

    let pastSingular = entries.reduce((sum, entry) => {
      const entryDate = parseDate(entry.date);
      if (entryDate >= periodStart && entryDate <= today) {
        const rawValue = parseFloat(entry.value) || 0;
        const convertedValue = fx.convert(rawValue, {
          from: entry.currency,
          to: mainCurrency
        });
        // Add income, subtract expenses
        return sum + (entry.isIncome ? convertedValue : -convertedValue);
      }
      return sum;
    }, 0);

    let pastRecurring = 0;
    let upcomingRecurring = 0;

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
            // Add income, subtract expenses for past recurring
            pastRecurring += recEntry.isIncome ? convertedValue : -convertedValue;
          } else if (!recEntry.isIncome) {
            // Only include expenses in upcoming recurring
            upcomingRecurring += convertedValue;
          }
        }
        currentDateStr = getNextDate(currentDateStr, recEntry.repeat);
        current = parseDate(currentDateStr);
      }
    });

    setAllocatedBudget(upcomingRecurring.toFixed(2).toString());
    const budgetValue = parseFloat(budget) || 0;
    const remaining = budgetValue + pastSingular + pastRecurring;
    setRemainingBudget(remaining.toFixed(2).toString());
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