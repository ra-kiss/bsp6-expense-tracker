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
    saveLocalData, mainCurrency, setMainCurrency, setExchangeRates,
    setCurrencies, setLastRatesUpdate, lastRatesUpdate, exchangeRates, ...setters
  } = appState;

  useBudgetCalculations(appState, setters);

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
      allocatedBudget: appState.allocatedBudget,
    });
  }, [
      appState.entries, appState.recurringEntries, appState.savingsProjects,
      appState.currencies, appState.mainCurrency, appState.budget,
      appState.budgetFrequency, appState.categories, appState.exchangeRates,
      appState.templates, appState.remainingBudget, appState.lastRatesUpdate,
      appState.allocatedBudget, saveLocalData
  ]);

  const updateRates = async (base) => {
    if (!base) return;
    try {
      const { rates, currencies } = await fetchRatesService(base);
      setExchangeRates(rates);
      setCurrencies(currencies);
      setLastRatesUpdate(dayjs().toISOString());
    } catch (error) {
      console.error("Failed to update rates:", error);
    }
  };
  
  // Effect 1: Fetch new rates ONLY when mainCurrency changes.
  // This is the most critical fix. It directly links the cause (currency change)
  // to the effect (fetching new rates for that currency).
  useEffect(() => {
    if (mainCurrency) {
      updateRates(mainCurrency);
    }
  }, [mainCurrency]); // <-- The dependency is ONLY mainCurrency.

  // Effect 2: Periodically check if rates are stale on initial load.
  // This handles the 24-hour update logic without interfering with currency changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ratesAreStale = !lastRatesUpdate || dayjs().diff(dayjs(lastRatesUpdate), 'hour') >= 24;

    if (ratesAreStale) {
      updateRates(mainCurrency);
    }
  }, []); // <-- Run only once on mount to check for staleness.

  // Effect 3: Always keep the 'money' library (fx) in sync with the React state.
  // The React state is the single source of truth. This effect ensures
  // any external libraries reflect that truth.
  useEffect(() => {
    if (mainCurrency && exchangeRates && Object.keys(exchangeRates).length > 0) {
      fx.base = mainCurrency;
      fx.rates = exchangeRates;
    }
  }, [mainCurrency, exchangeRates]); // <-- Syncs whenever rates or base currency change.

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