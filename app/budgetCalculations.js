import { useEffect } from 'react';
import dayjs from 'dayjs';
import fx from 'money';

// Helper function to parse date strings in 'DD/MM/YYYY' format
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to get the next recurring date
const getNextDate = (dateString, repeat) => {
  const dayjsDate = dayjs(parseDate(dateString));
  switch (repeat) {
    case 'day': return dayjsDate.add(1, 'day').format('D/M/YYYY');
    case 'week': return dayjsDate.add(7, 'day').format('D/M/YYYY');
    case 'month': return dayjsDate.add(1, 'month').format('D/M/YYYY');
    case 'year': return dayjsDate.add(1, 'year').format('D/M/YYYY');
    default: return dateString;
  }
};

export function useBudgetCalculations(state, setters) {
  const {
    entries, recurringEntries, savingsProjects, mainCurrency, budget,
    budgetFrequency, exchangeRates, remainingBudget,
  } = state;
  const { setRemainingBudget, setAllocatedBudget, setSavingsProjects, setShowWarning } = setters;

  // Recalculate remaining and allocated budget
  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) return;
    fx.base = mainCurrency;
    fx.rates = exchangeRates;

    const today = dayjs().toDate();
    const periodStart = budgetFrequency === 'weekly' 
      ? dayjs().startOf('week').toDate() 
      : dayjs().startOf('month').toDate();
    const periodEnd = budgetFrequency === 'weekly' 
      ? dayjs().endOf('week').toDate() 
      : dayjs().endOf('month').toDate();

    let pastSingular = entries.reduce((sum, entry) => {
      const entryDate = parseDate(entry.date);
      if (entryDate >= periodStart && entryDate <= today) {
        const value = fx.convert(parseFloat(entry.value) || 0, { from: entry.currency, to: mainCurrency });
        return sum + (entry.isIncome ? value : -value);
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
          const value = fx.convert(parseFloat(recEntry.value) || 0, { from: recEntry.currency, to: mainCurrency });
          if (current <= today) {
            pastRecurring += recEntry.isIncome ? value : -value;
          } else if (!recEntry.isIncome) {
            upcomingRecurring += value;
          }
        }
        currentDateStr = getNextDate(currentDateStr, recEntry.repeat);
        current = parseDate(currentDateStr);
      }
    });

    setAllocatedBudget(upcomingRecurring.toFixed(2));
    const remaining = (parseFloat(budget) || 0) + pastSingular + pastRecurring;
    setRemainingBudget(remaining.toFixed(2));
  }, [entries, recurringEntries, exchangeRates, mainCurrency, budget, budgetFrequency, setAllocatedBudget, setRemainingBudget]);

  // Check for budget warnings
  useEffect(() => {
    const normalizedRemainingBudget = parseFloat(remainingBudget || 0);
    const last30DaysEntries = entries.filter(e => dayjs(parseDate(e.date)).isAfter(dayjs().subtract(30, 'day')) && !e.isIncome);
    const totalSpentLast30Days = last30DaysEntries.reduce((sum, entry) => sum + fx.convert(parseFloat(entry.value) || 0, { from: entry.currency, to: mainCurrency }), 0);
    const dailyAverage = last30DaysEntries.length > 0 ? totalSpentLast30Days / 30 : 0;
    
    const remainingDays = budgetFrequency === 'weekly' 
      ? dayjs().endOf('week').diff(dayjs(), 'day') + 1
      : dayjs().endOf('month').diff(dayjs(), 'day') + 1;
      
    const extrapolatedSpending = dailyAverage * remainingDays;
    
    const totalSavingsGoals = savingsProjects.reduce((sum, p) => sum + fx.convert(parseFloat(p.goal) || 0, { from: p.currency, to: mainCurrency }), 0);
    const totalSavedAllTime = savingsProjects.reduce((sum, p) => sum + fx.convert(parseFloat(p.value) || 0, { from: p.currency, to: mainCurrency }), 0);
    const remainingSavingsNeeded = totalSavingsGoals - totalSavedAllTime;

    const shouldShowWarning = savingsProjects.length > 0 && totalSavingsGoals > 0 && normalizedRemainingBudget < (extrapolatedSpending + remainingSavingsNeeded);
    setShowWarning(shouldShowWarning);

  }, [entries, savingsProjects, remainingBudget, budgetFrequency, mainCurrency, exchangeRates, setShowWarning]);
}