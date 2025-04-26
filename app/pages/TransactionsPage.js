'use client';

import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import ListEntry from "../components/transactions/ListEntry";
import RecurringEntry from "../components/transactions/RecurringEntry";
import AddListEntryModal from "../components/transactions/AddListEntryModal";
import AddRecurringEntryModal from "../components/transactions/AddRecurringEntryModal";
import TransactionsTopBar from '../components/transactions/TransactionsTopBar';
import { useGlobal } from '../components/GlobalContext';
import dayjs from 'dayjs';

export default function TransactionsPage() {
  const theme = useTheme();
  const { entries, setEntries, recurringEntries, setRecurringEntries } = useGlobal();
  const [sort, setSort] = useState({ type: 'recency', order: 'asc' }); // Changed to 'asc' for earliest first
  const [addListEntryModalOpen, setAddListEntryModalOpen] = useState(false);
  const [addRecurringEntryModalOpen, setAddRecurringEntryModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    currency: '',
    date: ''
  });
  const [pageOffset, setPageOffset] = useState(0); // Track current page offset
  const transactionsPerPage = 10; // Display 10 transactions per page

  useEffect(() => {
    sortEntries(entries, sort.type, sort.order);
  }, []);

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
      case 'month': nextDate = dayjsDate.add(1, 'month'); break; // Improved for accurate month handling
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

    // Combine one-time entries and recurring instances
    const allTransactions = [
      ...entries.filter(entry => parseDate(entry.date) >= parseDate(today)),
      ...recurringInstances
    ];

    // Sort by date (ascending)
    return allTransactions.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  };

  // Add one-time entry
  const addEntry = (value, currency, category, date, notes) => {
    let curValue = value ? value : 0;
    let entryValues = { value: curValue, currency, category, date, notes };
    const newEntries = [entryValues, ...entries];
    sortEntries(newEntries, sort.type, sort.order);
  };

  // Add recurring entry
  const addRecurringEntry = (value, currency, category, date, notes, repeat) => {
    let curValue = value ? value : 0;
    let entryValues = { value: curValue, currency, category, date, notes, repeat, isRecurring: true };
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
        const valueA = parseFloat(a.value);
        const valueB = parseFloat(b.value);
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
    Object.entries(filter).every(([key, value]) =>
      value === '' || (key === 'date' ? compareDates(entry[key], value) : value.includes(entry[key]))
    )
  );

  // Get current page of transactions
  const displayedTransactions = filteredTransactions.slice(
    pageOffset,
    pageOffset + transactionsPerPage
  );

  return (
    <>
      <TransactionsTopBar sortEntries={sortEntries} setFilter={setFilter} />
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
        {displayedTransactions.length == 10 ? (
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
        <div className="fixed bottom-20 right-5 z-50">
          {/* <Fab sx={{ mr: 2 }} color="secondary" aria-label="view-recurring" size="medium" onClick={() => console.log(recurringEntries)}>
            <EventRepeatIcon />
          </Fab> */}
          <Fab sx={{ mr: 2 }} color="primary" aria-label="add-recurring" size="medium" onClick={() => setAddRecurringEntryModalOpen(true)}>
            <EventRepeatIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={() => setAddListEntryModalOpen(true)}>
            <AddIcon />
          </Fab>
        </div>
      </Box>
    </>
  );
}