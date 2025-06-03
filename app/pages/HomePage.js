'use client';

import Box from '@mui/material/Box';
import GenericTopBar from '../components/GenericTopBar';
import StatsModal from '../components/home/StatsModal';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { useGlobal } from '../components/GlobalContext';
import dayjs from 'dayjs';
import { PieChart } from '@mui/x-charts/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useState } from 'react';
import fx from 'money';

// Helper function to parse D/M/YYYY date strings
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Function to get the most used item based on entries and key
const getMostUsedItem = (entries, key, labelMap = {}) => {
  if (entries.length === 0) return 'None';
  const counts = entries.reduce((acc, entry) => {
    const item = entry[key];
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  const mostUsed = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  return labelMap[mostUsed] || mostUsed;
};

export default function HomePage() {
  const theme = useTheme();
  const {
    budget,
    remainingBudget,
    allocatedBudget,
    budgetFrequency,
    currencies,
    mainCurrency,
    entries,
    savingsProjects,
    exchangeRates,
    showWarning
  } = useGlobal();

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  // Configure fx.rates for currency conversion
  fx.rates = exchangeRates;

  // Normalize remainingBudget and budget to two decimal places
  const normalizedRemainingBudget = parseFloat(remainingBudget || 0).toFixed(2);
  const normalizedBudget = parseFloat(budget || 0).toFixed(2);

  // Filter entries for current month and week
  const thisMonthEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'month')
  );
  const thisWeekEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'week')
  );

  const entriesForFrequency = budgetFrequency === "weekly" ? thisWeekEntries : thisMonthEntries;
  const periodLabel = budgetFrequency === "weekly" ? "week" : "month";

  // Calculate total spent
  const totalSpentThisWeek = thisWeekEntries.reduce((sum, entry) => {
    const rawValue = parseFloat(entry.value) || 0;
    return sum + fx.convert(rawValue, { from: entry.currency, to: mainCurrency });
  }, 0).toFixed(2);

  const totalSpentThisMonth = thisMonthEntries.reduce((sum, entry) => {
    const rawValue = parseFloat(entry.value) || 0;
    return sum + fx.convert(rawValue, { from: entry.currency, to: mainCurrency });
  }, 0).toFixed(2);

  const totalSpentAllTime = entries.reduce((sum, entry) => {
    const rawValue = parseFloat(entry.value) || 0;
    return sum + fx.convert(rawValue, { from: entry.currency, to: mainCurrency });
  }, 0).toFixed(2);

  // Calculate total saved and total savings goals
  const totalSavedAllTime = savingsProjects.reduce((sum, project) => {
    const rawValue = parseFloat(project.value) || 0;
    return sum + fx.convert(rawValue, { from: project.currency, to: mainCurrency });
  }, 0).toFixed(2);

  const totalSavingsGoals = savingsProjects.reduce((sum, project) => {
    const rawGoal = parseFloat(project.goal) || 0;
    return sum + fx.convert(rawGoal, { from: project.currency, to: mainCurrency });
  }, 0).toFixed(2);

  // Calculate most used categories
  const mostUsedCategoryThisWeek = getMostUsedItem(thisWeekEntries, 'category');
  const mostUsedCategoryThisMonth = getMostUsedItem(thisMonthEntries, 'category');
  const mostUsedCategoryAllTime = getMostUsedItem(entries, 'category');

  // Calculate most used currencies
  const currencyLabelMap = Object.fromEntries(currencies.map(c => [c.value, c.label]));
  const mostUsedCurrencyThisWeek = getMostUsedItem(thisWeekEntries, 'currency', currencyLabelMap);
  const mostUsedCurrencyThisMonth = getMostUsedItem(thisMonthEntries, 'currency', currencyLabelMap);
  const mostUsedCurrencyAllTime = getMostUsedItem(entries, 'currency', currencyLabelMap);

  // Create stats dictionary
  const stats = {
    totalSpentThisWeek,
    totalSpentThisMonth,
    totalSpentAllTime,
    totalSavedAllTime,
    mostUsedCategoryThisWeek,
    mostUsedCategoryThisMonth,
    mostUsedCategoryAllTime,
    mostUsedCurrencyThisWeek,
    mostUsedCurrencyThisMonth,
    mostUsedCurrencyAllTime,
  };

  // Pie Chart Data: Distribution by Category (counts)
  const categoryCounts = entriesForFrequency.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(
    ([label, count], idx) => ({
      id: idx,
      value: count,
      label
    })
  );

  // Pie Chart Data: Distribution by Currency (counts)
  const currencyCounts = entriesForFrequency.reduce((acc, entry) => {
    acc[entry.currency] = (acc[entry.currency] || 0) + 1;
    return acc;
  }, {});
  const currencyData = Object.entries(currencyCounts).map(
    ([code, count], idx) => {
      const label = currencies.find((c) => c.value === code)?.label || code;
      return { id: idx, value: count, label };
    }
  );

  // Most Used Category & Currency for the current period
  const mostUsedCategory = getMostUsedItem(entriesForFrequency, 'category');
  const mostUsedCurrency = getMostUsedItem(entriesForFrequency, 'currency', currencyLabelMap);

  // // Calculate daily average spending from last 30 days
  // const thirtyDaysAgo = dayjs().subtract(30, 'day').startOf('day');
  // const last30DaysEntries = entries.filter((e) => {
  //   const entryDate = dayjs(parseDate(e.date));
  //   return entryDate.isAfter(thirtyDaysAgo) && !e.isIncome; // Exclude income entries
  // });

  // const totalSpentLast30Days = last30DaysEntries.reduce((sum, entry) => {
  //   const rawValue = parseFloat(entry.value) || 0;
  //   return sum + fx.convert(rawValue, { from: entry.currency, to: mainCurrency });
  // }, 0);

  // const dailyAverage = last30DaysEntries.length > 0 ? totalSpentLast30Days / 30 : 0;

  // // Calculate remaining days in budget period
  // let remainingDays;
  // if (budgetFrequency === 'weekly') {
  //   const now = dayjs();
  //   const dayOfWeek = now.day();
  //   const endOfWeek = now.endOf('week');
  //   remainingDays = endOfWeek.diff(now, 'day') + 1; // Include today
  // } else {
  //   const endOfMonth = dayjs().endOf('month');
  //   remainingDays = endOfMonth.diff(dayjs(), 'day') + 1; // Include today
  // }

  // // Extrapolate spending
  // const extrapolatedSpending = dailyAverage * remainingDays;

  // // Calculate remaining savings needed
  // const remainingSavingsNeeded = parseFloat(totalSavingsGoals) - parseFloat(totalSavedAllTime);

  // // Check if remaining budget is sufficient
  // const showWarningValue = parseFloat(normalizedRemainingBudget) < (extrapolatedSpending + remainingSavingsNeeded);

  return (
    <>
      <GenericTopBar title="Home" />
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box sx={{ p: 1 }}>
        {showWarning && (
          <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 10 }}>
            Warning: Based on your current spending rate, you may not have enough budget to meet your savings goals.
          </Alert>
        )}
        <Card variant="outlined">
          <CardActionArea>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
                  <b>{normalizedRemainingBudget}/{normalizedBudget} {mainCurrencyLabel}</b> left this {periodLabel}
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="buffer"
                  value={(parseFloat(normalizedRemainingBudget) / parseFloat(normalizedBudget)) * 100}
                  valueBuffer={(parseFloat(allocatedBudget || 0) / parseFloat(normalizedBudget)) * 100}
                />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }} variant="outlined">
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 12 }} className="font-bold" component="div">
                  This {periodLabel}'s
                </Typography>
                <Typography sx={{ fontSize: 13 }} className="font-bold" component="div">
                  <b>Most Used Currency</b> <Typography component="span" sx={{fontSize: 12}}>is</Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} component="div">
                    {mostUsedCurrency}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ flex: 1 }} variant="outlined">
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 12 }} className="font-bold" component="div">
                  This {periodLabel}'s
                </Typography>
                <Typography sx={{ fontSize: 13 }} className="font-bold" component="div">
                  <b>Most Used Category</b> <Typography component="span" sx={{fontSize: 12}}>is</Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} component="div">
                    {mostUsedCategory}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        {/* Pie Charts */}
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Distribution by Category */}
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 16, mb: 1 }} className="font-bold">
                <b>Category Distribution</b> this {periodLabel}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart series={[{ data: categoryData }]} width={150} height={150} />
              </Box>
            </CardContent>
          </Card>

          {/* Distribution by Currency */}
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 16, mb: 1 }} className="font-bold">
                <b>Currency Distribution</b> this {periodLabel}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart series={[{ data: currencyData }]} width={150} height={150} />
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardActionArea onClick={handleOpenModal}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BarChartIcon sx={{ fontSize: 24, mr: 1, color: 'primary' }} />
                  <Typography sx={{ fontSize: 18 }}>More</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>

          <Box sx={{mt: 6}}/>
        </Box>
        <StatsModal open={modalOpen} onClose={handleCloseModal} stats={stats}/>
      </Box>
    </>
  );
}