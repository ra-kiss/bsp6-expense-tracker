'use client';

import { useState } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

const defaultState = {
  entries: [],
  recurringEntries: [],
  savingsProjects: [],
  currencies: [],
  mainCurrency: 'USD',
  budget: '100',
  budgetFrequency: 'monthly',
  categories: ['Groceries', 'Housing', 'Gas', 'Other'],
  exchangeRates: {},
  templates: [],
  remainingBudget: '100',
  allocatedBudget: '0',
  lastRatesUpdate: null,
};

export function useAppState() {
  const [localData, saveLocalData] = useLocalStorage("localData", defaultState);

  const [entries, setEntries] = useState(localData.entries || defaultState.entries);
  const [recurringEntries, setRecurringEntries] = useState(localData.recurringEntries || defaultState.recurringEntries);
  const [savingsProjects, setSavingsProjects] = useState(localData.savingsProjects || defaultState.savingsProjects);
  const [currencies, setCurrencies] = useState(localData.currencies || defaultState.currencies);
  const [mainCurrency, setMainCurrency] = useState(localData.mainCurrency || defaultState.mainCurrency);
  const [budget, setBudget] = useState(localData.budget || defaultState.budget);
  const [budgetFrequency, setBudgetFrequency] = useState(localData.budgetFrequency || defaultState.budgetFrequency);
  const [categories, setCategories] = useState(localData.categories || defaultState.categories);
  const [exchangeRates, setExchangeRates] = useState(localData.exchangeRates || defaultState.exchangeRates);
  const [templates, setTemplates] = useState(localData.templates || defaultState.templates);
  const [remainingBudget, setRemainingBudget] = useState(localData.remainingBudget || defaultState.remainingBudget);
  const [allocatedBudget, setAllocatedBudget] = useState(localData.allocatedBudget || defaultState.allocatedBudget);
  const [lastRatesUpdate, setLastRatesUpdate] = useState(localData.lastRatesUpdate || defaultState.lastRatesUpdate);
  const [showWarning, setShowWarning] = useState(false);

  return {
    localData, saveLocalData,
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
    lastRatesUpdate, setLastRatesUpdate,
    showWarning, setShowWarning
  };
}