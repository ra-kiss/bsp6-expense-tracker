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
import { PieChart } from '@mui/x-charts/PieChart';

// Helper function to parse D/M/YYYY date strings
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function HomePage() {
  const theme = useTheme();
  const {
    budget,
    remainingBudget,
    allocatedBudget,
    currencies,
    mainCurrency,
    entries
  } = useGlobal();
  
  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';
  // Filter entries for current month
  const thisMonthEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'month')
);

// === Pie Chart Data: Monthly Distribution by Category (counts) ===
  const thisMonthCategoryCounts = thisMonthEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(thisMonthCategoryCounts).map(
    ([label, count], idx) => ({
      id: idx,
      value: count,
      label
    })
  );

  // === Pie Chart Data: Monthly Distribution by Currency (counts) ===
  const thisMonthCurrencyCounts = thisMonthEntries.reduce((acc, entry) => {
    acc[entry.currency] = (acc[entry.currency] || 0) + 1;
    return acc;
  }, {});
  const currencyData = Object.entries(thisMonthCurrencyCounts).map(
    ([code, count], idx) => {
      const label = currencies.find((c) => c.value === code)?.label || code;
      return { id: idx, value: count, label };
    }
  );

  // === Most Used Category & Currency Calculations (unchanged) ===
  const categoryCounts = entries.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.category]: (acc[entry.category] || 0) + 1
    }),
    {}
  );
  const mostUsedCategory =
    Object.keys(categoryCounts).length > 0
      ? Object.keys(categoryCounts).reduce((a, b) =>
          categoryCounts[a] > categoryCounts[b] ? a : b
        )
      : 'None';

  const thisWeekEntries = entries.filter((e) =>
    dayjs(parseDate(e.date)).isSame(dayjs(), 'week')
  );
  const mostUsedCategoryThisMonth =
    thisMonthEntries.length > 0
      ? Object.keys(
          thisMonthEntries.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + 1;
            return acc;
          }, {})
        ).reduce((a, b) =>
          thisMonthEntries.reduce(
            (c, e) => ({ ...c, [e.category]: (c[e.category] || 0) + 1 }),
            {}
          )[a] >
          thisMonthEntries.reduce(
            (c, e) => ({ ...c, [e.category]: (c[e.category] || 0) + 1 }),
            {}
          )[b]
            ? a
            : b
        )
      : 'None';
  const mostUsedCategoryThisWeek =
    thisWeekEntries.length > 0
      ? Object.keys(
          thisWeekEntries.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + 1;
            return acc;
          }, {})
        ).reduce((a, b) =>
          thisWeekEntries.reduce(
            (c, e) => ({ ...c, [e.category]: (c[e.category] || 0) + 1 }),
            {}
          )[a] >
          thisWeekEntries.reduce(
            (c, e) => ({ ...c, [e.category]: (c[e.category] || 0) + 1 }),
            {}
          )[b]
            ? a
            : b
        )
      : 'None';

  const currencyCountsAllTime = entries.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.currency]: (acc[entry.currency] || 0) + 1
    }),
    {}
  );
  const mostUsedCurrency =
    Object.keys(currencyCountsAllTime).length > 0
      ? Object.keys(currencyCountsAllTime).reduce((a, b) =>
          currencyCountsAllTime[a] > currencyCountsAllTime[b] ? a : b
        )
      : 'None';
  const mostUsedCurrencyLabel =
    currencies.find((c) => c.value === mostUsedCurrency)?.label ||
    mostUsedCurrency;

  const mostUsedCurrencyThisMonth =
    thisMonthEntries.length > 0
      ? Object.keys(
          thisMonthEntries.reduce((acc, e) => {
            acc[e.currency] = (acc[e.currency] || 0) + 1;
            return acc;
          }, {})
        ).reduce((a, b) =>
          thisMonthEntries.reduce(
            (c, e) => ({ ...c, [e.currency]: (c[e.currency] || 0) + 1 }),
            {}
          )[a] >
          thisMonthEntries.reduce(
            (c, e) => ({ ...c, [e.currency]: (c[e.currency] || 0) + 1 }),
            {}
          )[b]
            ? a
            : b
        )
      : 'None';
  const mostUsedCurrencyThisMonthLabel =
    currencies.find((c) => c.value === mostUsedCurrencyThisMonth)?.label ||
    mostUsedCurrencyThisMonth;
  const mostUsedCurrencyThisWeek =
    thisWeekEntries.length > 0
      ? Object.keys(
          thisWeekEntries.reduce((acc, e) => {
            acc[e.currency] = (acc[e.currency] || 0) + 1;
            return acc;
          }, {})
        ).reduce((a, b) =>
          thisWeekEntries.reduce(
            (c, e) => ({ ...c, [e.currency]: (c[e.currency] || 0) + 1 }),
            {}
          )[a] >
          thisWeekEntries.reduce(
            (c, e) => ({ ...c, [e.currency]: (c[e.currency] || 0) + 1 }),
            {}
          )[b]
            ? a
            : b
        )
      : 'None';
  const mostUsedCurrencyThisWeekLabel =
    currencies.find((c) => c.value === mostUsedCurrencyThisWeek)?.label ||
    mostUsedCurrencyThisWeek;

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

        {/* Pie Charts  */}
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Monthly Distribution by Category */}
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16, mb: 1 }} className="font-bold">
                Category Distribution <b>this Month</b> 
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart series={[{ data: categoryData }]} width={150} height={150} />
              </Box>
            </CardContent>
          </Card>

          {/* Monthly Distribution by Currency */}
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16, mb: 1 }} className="font-bold">
                Currency Distribution <b>this Month</b> 
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart series={[{ data: currencyData }]} width={150} height={150} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}
