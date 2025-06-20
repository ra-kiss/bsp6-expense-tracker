import { useState } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

export function useAppState() {
  const [localData, saveLocalData] = useLocalStorage("localData", null);

  const [entries, setEntries] = useState([]);
  const [recurringEntries, setRecurringEntries] = useState([]);
  const [savingsProjects, setSavingsProjects] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [mainCurrency, setMainCurrency] = useState('USD');
  const [budget, setBudget] = useState('100');
  const [budgetFrequency, setBudgetFrequency] = useState('monthly');
  const [categories, setCategories] = useState(['Groceries', 'Housing', 'Gas', 'Other']);
  const [exchangeRates, setExchangeRates] = useState({});
  const [templates, setTemplates] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState('100');
  const [allocatedBudget, setAllocatedBudget] = useState('0');
  const [lastRatesUpdate, setLastRatesUpdate] = useState(null);
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