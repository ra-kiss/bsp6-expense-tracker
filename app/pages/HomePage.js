'use client';

import Box from '@mui/material/Box';
import HomeTopBar from '../components/home/HomeTopBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import { useGlobal } from '../components/GlobalContext';
import dayjs from 'dayjs';

// Helper function to parse D/M/YYYY date strings
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function HomePage() {
  const theme = useTheme();
  const { budget, remainingBudget, allocatedBudget, currencies, mainCurrency, entries } = useGlobal();

  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  // Calculate most used category
  const categoryCounts = entries.reduce((acc, entry) => ({ ...acc, [entry.category]: (acc[entry.category] || 0) + 1 }), {});
  const mostUsedCategory = Object.keys(categoryCounts).length > 0 ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b) : 'None';

  // Calculate most used category this month and this week
  const thisMonthEntries = entries.filter(e => dayjs(parseDate(e.date)).isSame(dayjs(), 'month'));
  const thisWeekEntries = entries.filter(e => dayjs(parseDate(e.date)).isSame(dayjs(), 'week'));
  const mostUsedCategoryThisMonth = thisMonthEntries.length > 0 ? Object.keys(thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})).reduce((a, b) => thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})[a] > thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})[b] ? a : b) : 'None';
  const mostUsedCategoryThisWeek = thisWeekEntries.length > 0 ? Object.keys(thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})).reduce((a, b) => thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})[a] > thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})[b] ? a : b) : 'None';

  // Calculate most used currency
  const currencyCounts = entries.reduce((acc, entry) => ({ ...acc, [entry.currency]: (acc[entry.currency] || 0) + 1 }), {});
  const mostUsedCurrency = Object.keys(currencyCounts).length > 0 ? Object.keys(currencyCounts).reduce((a, b) => currencyCounts[a] > currencyCounts[b] ? a : b) : 'None';
  const mostUsedCurrencyLabel = currencies.find(currency => currency.value === mostUsedCurrency)?.label || mostUsedCurrency;

  // Calculate most used currency this month and this week
  const mostUsedCurrencyThisMonth = thisMonthEntries.length > 0 ? Object.keys(thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})).reduce((a, b) => thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})[a] > thisMonthEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})[b] ? a : b) : 'None';
  const mostUsedCurrencyThisMonthLabel = currencies.find(currency => currency.value === mostUsedCurrencyThisMonth)?.label || mostUsedCurrencyThisMonth;
  const mostUsedCurrencyThisWeek = thisWeekEntries.length > 0 ? Object.keys(thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})).reduce((a, b) => thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})[a] > thisWeekEntries.reduce((acc, e) => ({ ...acc, [e.currency]: (acc[e.currency] || 0) + 1 }), {})[b] ? a : b) : 'None';
  const mostUsedCurrencyThisWeekLabel = currencies.find(currency => currency.value === mostUsedCurrencyThisWeek)?.label || mostUsedCurrencyThisWeek;

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
                  {remainingBudget}/{budget} {mainCurrencyLabel} Remaining
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <LinearProgress variant="buffer" value={(remainingBudget / budget) * 100} valueBuffer={(allocatedBudget / budget ) * 100} />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 14 }} className="font-bold" component="div">
                    Your most used currency <b>of all time</b> is
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} className="font-bold" component="div">
                    {mostUsedCurrencyLabel}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 14 }} className="font-bold" component="div">
                    <b>This Week</b> it's
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} className="font-bold" component="div">
                    {mostUsedCurrencyThisWeekLabel}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 14 }} className="font-bold" component="div">
                    <b>This Month</b> it's
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} className="font-bold" component="div">
                    {mostUsedCurrencyThisMonthLabel}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 16 }} component="div">
                    Your most used category <b>of all time</b> is
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 'bold' }} className="font-bold" component="div">
                    {mostUsedCategory}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <Box sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 14 }} component="div">
                    <b>This week</b> it's
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} component="div">
                    {mostUsedCategoryThisWeek}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardActionArea>
              <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 14 }} component="div">
                    <b>This month</b> it's
                  </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} component="div">
                    {mostUsedCategoryThisMonth}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
      
    </>
  );
}