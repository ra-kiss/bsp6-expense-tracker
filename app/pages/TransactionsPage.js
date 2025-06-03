'use client';

import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import ListEntry from "../components/transactions/ListEntry";
import RecurringEntry from "../components/transactions/RecurringEntry";
import AddListEntryModal from "../components/transactions/AddListEntryModal";
import AddRecurringEntryModal from "../components/transactions/AddRecurringEntryModal";
import TransactionsFilterModal from '../components/transactions/TransactionsFilterModal';
import GenericTopBar from "../components/GenericTopBar";
import TemplateListModal from '../components/transactions/TemplateListModal';
import { useGlobal } from '../components/GlobalContext';
import dayjs from 'dayjs';
import fx from 'money';

export default function TransactionsPage() {
  const theme = useTheme();
  const { entries, setEntries, recurringEntries, setRecurringEntries, exchangeRates, mainCurrency } = useGlobal();
  const [sort, setSort] = useState({ type: 'recency', order: 'asc' }); // Earliest first
  const [addListEntryModalOpen, setAddListEntryModalOpen] = useState(false);
  const [addRecurringEntryModalOpen, setAddRecurringEntryModalOpen] = useState(false);
  const [templateListModalOpen, setTemplateListModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    currency: '',
    date: '',
    isIncome: ''
  });
  const [pageOffset, setPageOffset] = useState(0); // Track current page offset
  const transactionsPerPage = 10; // Display 10 transactions per page

  fx.rates = exchangeRates;

  useEffect(() => {
    sortEntries(entries, sort.type, sort.order);
  }, []);

  const sortOptions = [
    { type: 'recency', order: 'desc', label: 'Sort by Recency (desc.)' },
    { type: 'recency', order: 'asc', label: 'Sort by Recency (asc.)' },
    { type: 'value', order: 'desc', label: 'Sort by Value (desc.)' },
    { type: 'value', order: 'asc', label: 'Sort by Value (asc.)' },
  ];

  // Parse date string (D/M/YYYY) to Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Generate the next date based on repeat frequency
  const getNextDate = (dateString, repeat) => {
    const date = parseDate(dateString);
    const dayjsDate = dayjs(date);
    let nextDate;
    switch (repeat) {
      case 'day': nextDate = dayjsDate.add(1, 'day'); break;
      case 'week': nextDate = dayjsDate.add(7, 'day'); break;
      case 'month': nextDate = dayjsDate.add(1, 'month'); break;
      case 'year': nextDate = dayjsDate.add(1, 'year'); break;
      default: nextDate = dayjsDate;
    }
    return nextDate.format('D/M/YYYY');
  };

  // Generate recurring transaction instances for a date range
  const generateRecurringInstances = (recurringEntry, startDate, endDate) => {
    const instances = [];
    let currentDate = recurringEntry.date;
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    while (parseDate(currentDate) <= end) {
      if (parseDate(currentDate) >= start) {
        instances.push({
          ...recurringEntry,
          date: currentDate,
          isRecurringInstance: true
        });
      }
      currentDate = getNextDate(currentDate, recurringEntry.repeat);
    }
    return instances;
  };

  // Get all transactions (one-time + recurring instances) for display
  const getTransactions = () => {
    const today = dayjs().format('D/M/YYYY');
    const endDate = dayjs().add(1, 'year').format('D/M/YYYY'); // Look ahead 1 year

    // Generate all recurring instances
    const recurringInstances = recurringEntries.flatMap(entry =>
      generateRecurringInstances(entry, today, endDate)
    );

    // Combine all one-time entries and recurring instances
    const allTransactions = [
      ...entries, // Include all one-time entries, past and future
      ...recurringInstances
    ];

    // Sort by date (ascending)
    return allTransactions.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  };

  // Add one-time entry
  const addEntry = (value, currency, category, date, notes, isIncome) => {
    let curValue = value ? value : 0;
    console.log(isIncome);
    let entryValues = { value: curValue, currency, category, date, notes, isIncome };
    const newEntries = [entryValues, ...entries];
    sortEntries(newEntries, sort.type, sort.order);
  };

  // Add recurring entry
  const addRecurringEntry = (value, currency, category, date, notes, repeat, isIncome) => {
    let curValue = value ? value : 0;
    let entryValues = { value: curValue, currency, category, date, notes, repeat, isIncome, isRecurring: true, templateIndex: recurringEntries.length };
    setRecurringEntries(prev => [entryValues, ...prev]);
  };

  // Sort entries (used for one-time entries)
  const sortEntries = (entries, type, order) => {
    setSort({ type, order });
    let sorted;
    if (type === 'recency') {
      sorted = [...entries].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (type === 'value') {
      sorted = [...entries].sort((a, b) => {
        const valueA = fx.convert(parseFloat(a.value) || 0, { from: a.currency, to: mainCurrency });
        const valueB = fx.convert(parseFloat(b.value) || 0, { from: b.currency, to: mainCurrency });
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }
    setEntries(sorted);
  };

  // Compare dates for filtering
  const compareDates = (date, bounds) => {
    const [lower, upper] = bounds;
    return parseDate(date) >= parseDate(lower) && parseDate(date) <= parseDate(upper);
  };

  // Handle navigation
  const handlePrevious = () => {
    setPageOffset(prev => Math.max(0, prev - transactionsPerPage));
  };

  const handleNext = () => {
    setPageOffset(prev => prev + transactionsPerPage);
  };

  // Get all transactions
  const allTransactions = getTransactions();

  // Apply filters
  const filteredTransactions = allTransactions.filter(entry =>
    Object.entries(filter).every(([key, value]) => {
      if (value === '') return true;
      if (key === 'date') return compareDates(entry[key], value);
      if (key === 'isIncome') return String(entry.isIncome) === String(value); // Compare as strings for simplicity
      return value.includes(entry[key]);
    })
  );  

  // Get current pageParser
  const displayedTransactions = filteredTransactions.slice(
    pageOffset,
    pageOffset + transactionsPerPage
  );

  return (
    <>
      {/* <TransactionsTopBar sortEntries={sortEntries} setFilter={setFilter} /> */}
      <TransactionsFilterModal open={filterModalOpen} setFilter={setFilter} onClose={() => setFilterModalOpen(false)} />
      <GenericTopBar
        title="Transactions"
        showFilter
        showSort
        onFilterClick={() => setFilterModalOpen(true)}
        sortOptions={sortOptions}
        onSort={(type, order) => sortEntries(entries, type, order)}
      />
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box sx={{ mb: 8 }}>
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((entry, index) => (
            entry.isRecurringInstance ? (
              <RecurringEntry key={`${entry.date}-${index}`} index={index} entryValues={entry} />
            ) : (
              <ListEntry key={`${entry.date}-${index}`} index={index} entryValues={entry} />
            )
          ))
        ) : (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            No transactions found.
          </Box>
        )}
        {displayedTransactions.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, mb: 2, ml: 1 }}>
            <IconButton
              onClick={handlePrevious}
              disabled={pageOffset === 0}
              aria-label="Previous transactions"
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              disabled={pageOffset + transactionsPerPage >= filteredTransactions.length}
              aria-label="Next transactions"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        ) : (<></>)}
        <AddListEntryModal open={addListEntryModalOpen} setOpen={setAddListEntryModalOpen} addEntry={addEntry} />
        <AddRecurringEntryModal open={addRecurringEntryModalOpen} setOpen={setAddRecurringEntryModalOpen} addRecurringEntry={addRecurringEntry} />
        <TemplateListModal open={templateListModalOpen} onClose={() => setTemplateListModalOpen(false)} addEntry={addEntry} />
        <div className="fixed bottom-20 right-5 z-50">
          <Fab sx={{ mr: 2 }} color="primary" aria-label="add-recurring" size="medium" onClick={() => setAddRecurringEntryModalOpen(true)}>
            <EventRepeatIcon />
          </Fab>
          <Fab sx={{ mr: 2 }} color="primary" aria-label="templates" size="medium" onClick={() => setTemplateListModalOpen(true)}>
            <AssignmentIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={() => setAddListEntryModalOpen(true)}>
            <AddIcon />
          </Fab>
        </div>
      </Box>
    </>
  );
}