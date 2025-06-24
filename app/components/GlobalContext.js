'use client';

import { createContext, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import fx from 'money';
import { useAppState } from '../appState';
import { useBudgetCalculations } from '../budgetCalculations';
import { fetchExchangeRates as fetchRatesService } from '../exchangeRateService';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const appState = useAppState();
  const {
    localData, saveLocalData, mainCurrency, setMainCurrency, setExchangeRates,
    setCurrencies, setLastRatesUpdate, lastRatesUpdate, exchangeRates, ...setters
  } = appState;

  // Pass state and setters to the calculation hook
  useBudgetCalculations(appState, setters);

  // Effect to load data from local storage on initial mount
  useEffect(() => {
    if (localData) {
      setters.setEntries(localData.entries || []);
      setters.setRecurringEntries(localData.recurringEntries || []);
      setters.setSavingsProjects(localData.savingsProjects || []);
      setCurrencies(localData.currencies || []);
      setMainCurrency(localData.mainCurrency || 'USD');
      setters.setBudget(localData.budget || '100');
      setters.setBudgetFrequency(localData.budgetFrequency || 'monthly');
      setters.setCategories(localData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
      setExchangeRates(localData.exchangeRates || {});
      setters.setTemplates(localData.templates || []);
      setters.setRemainingBudget(localData.remainingBudget || localData.budget || '100');
      setLastRatesUpdate(localData.lastRatesUpdate || null);
    }
  }, []);

  // Effect to save all state to local storage whenever it changes
  useEffect(() => {
    saveLocalData({
      entries: appState.entries,
      recurringEntries: appState.recurringEntries,
      savingsProjects: appState.savingsProjects,
      currencies: appState.currencies,
      mainCurrency: appState.mainCurrency,
      budget: appState.budget,
      budgetFrequency: appState.budgetFrequency,
      categories: appState.categories,
      exchangeRates: appState.exchangeRates,
      templates: appState.templates,
      remainingBudget: appState.remainingBudget,
      lastRatesUpdate: appState.lastRatesUpdate,
    });
  }, [appState, saveLocalData]);

  const updateRates = async () => {
    const { rates, currencies } = await fetchRatesService(mainCurrency);
    setExchangeRates(rates);
    setCurrencies(currencies);
    setLastRatesUpdate(dayjs().toISOString());
    fx.base = mainCurrency;
    fx.rates = rates;
  }
  
  // Effect to fetch exchange rates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lastRatesUpdate && dayjs().diff(dayjs(lastRatesUpdate), 'hour') < 24) {
      return;
    }
    updateRates();
  }, [lastRatesUpdate, setExchangeRates, setCurrencies, setLastRatesUpdate]);

  useEffect(() => {
    updateRates();
  }, [mainCurrency])

  const exportDataToJson = () => {
    const dataToExport = {
        entries: appState.entries, recurringEntries: appState.recurringEntries,
        savingsProjects: appState.savingsProjects, currencies: appState.currencies,
        mainCurrency: appState.mainCurrency, budget: appState.budget,
        budgetFrequency: appState.budgetFrequency, categories: appState.categories,
        exchangeRates: appState.exchangeRates, templates: appState.templates,
        remainingBudget: appState.remainingBudget, lastRatesUpdate: appState.lastRatesUpdate
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'budget-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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

          // Use setters from the appState to update the context state
          setters.setEntries(importedData.entries || []);
          setters.setRecurringEntries(importedData.recurringEntries || []);
          setters.setSavingsProjects(importedData.savingsProjects || []);
          setCurrencies(importedData.currencies || []);
          setMainCurrency(importedData.mainCurrency || 'USD');
          setters.setBudget(importedData.budget || '100');
          setters.setBudgetFrequency(importedData.budgetFrequency || 'monthly');
          setters.setCategories(importedData.categories || ['Groceries', 'Housing', 'Gas', 'Other']);
          setExchangeRates(importedData.exchangeRates || {});
          setters.setTemplates(importedData.templates || []);
          setters.setRemainingBudget(importedData.remainingBudget || importedData.budget || '100');
          setLastRatesUpdate(importedData.lastRatesUpdate || null);

        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Failed to import settings. Please ensure the file is a valid JSON.');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };


  return (
    <GlobalContext.Provider value={{
      ...appState,
      exportDataToJson,
      importDataFromJson
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}