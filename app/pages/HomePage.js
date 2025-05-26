'use client';

import Box from '@mui/material/Box';
import HomeTopBar from '../components/home/HomeTopBar';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import { useGlobal } from '../components/GlobalContext';
import dayjs from 'dayjs';
import { PieChart } from '@mui/x-charts/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

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
    entries
  } = useGlobal();
  
  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  // Filter entries for current month and week
  const thisMonthEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'month')
  );
  const thisWeekEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'week')
  );

  // Determine entries based on budget frequency
  const entriesForFrequency = budgetFrequency === "weekly" ? thisWeekEntries : thisMonthEntries;

  // Label for the period
  const periodLabel = budgetFrequency === "weekly" ? "week" : "month";

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
  const mostUsedCurrency = getMostUsedItem(entriesForFrequency, 'currency', Object.fromEntries(currencies.map(c => [c.value, c.label])));

  return (
    <>
      <HomeTopBar />
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box sx={{ p: 1 }}>
        <Card>
          <CardActionArea>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
                  <b>{remainingBudget}/{budget} {mainCurrencyLabel}</b> left this {periodLabel}
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="buffer"
                  value={(remainingBudget / budget) * 100}
                  valueBuffer={(allocatedBudget / budget) * 100}
                />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 12 }} className="font-bold" component="div">
                  This {periodLabel}'s
                </Typography>
                <Typography sx={{ fontSize: 13 }} className="font-bold" component="div">
                  <b>Most Used Currency</b> <Typography component="span" sx={{fontSize: 12}}>is</Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} className="font-bold" component="div">
                    {mostUsedCurrency}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ flex: 1 }}>
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
          <Card>
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
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16, mb: 1 }} className="font-bold">
                <b>Currency Distribution</b> this {periodLabel}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart series={[{ data: currencyData }]} width={150} height={150} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardActionArea>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BarChartIcon sx={{ fontSize: 28, mr: 1, color: 'primary' }} />
                  <Typography sx={{ fontSize: 18 }}>More</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </>
  );
}