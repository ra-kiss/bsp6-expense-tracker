'use client';

import { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import { useTheme } from '@mui/material/styles';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Navbar from "./components/Navbar";
import ListEntry from "./components/ListEntry";
import RecurringEntry from "./components/RecurringEntry";
import AddListEntryModal from "./components/AddListEntryModal";
import AddRecurringEntryModal from "./components/AddRecurringEntryModal";
import TransactionsTopBar from './components/TransactionsTopBar';
import { useGlobal } from './components/GlobalContext';

import dayjs from 'dayjs';


export default function Home() {
  const theme = useTheme();
  const { entries, setEntries, recurringEntries, setRecurringEntries } = useGlobal();
  const [sort, setSort] = useState({"type": 'recency', "order": 'desc'});
  const [addListEntryModalOpen, setAddListEntryModalOpen] = useState(false);
  const [addRecurringEntryModalOpen, setAddRecurringEntryModalOpen] = useState(false);

  const [filter, setFilter] = useState({
    "category": '',
    "currency": '',
    "date": ''
  });

  useEffect(() => {
    sortEntries(entries, sort.type, sort.order);
  }, []);


  const addEntry = (value, currency, category, date, notes) => {
    let curValue = value ? value : 0;
    let entryValues = {
      'value': curValue,
      'currency': currency,
      'category': category,
      'date': date,
      'notes': notes
    }
    const newEntries = [entryValues, ...entries];
    sortEntries(newEntries, sort.type, sort.order);
  };

  const addRecurringEntry = (value, currency, category, date, notes, repeat) => {
    let curValue = value ? value : 0;
    let entryValues = {
      'value': curValue,
      'currency': currency,
      'category': category,
      'date': date,
      'notes': notes,
      'repeat': repeat
    }
    // Generate the first three iteration dates
    const D0 = date; // Initial date
    const D1 = getNextDate(D0, repeat); // Date + repeat
    const D2 = getNextDate(D1, repeat); // Date + 2*repeat
    const dates = [D0, D1, D2];

    const newEntries = dates.map(d => ({
      value: curValue,
      currency,
      category,
      date: d,
      notes: notes,
      repeat: repeat
    }));

    const allEntries = [...newEntries, ...entries]; 
    sortEntries(allEntries, sort.type, sort.order);

    const recurringEntry = {
      value: curValue,
      currency,
      category,
      date: D2, // Last iteration date
      notes,
      repeat,
      isRecurring: true // Optional flag to identify recurring entries
    };
    setRecurringEntries(prev => [recurringEntry, ...prev]);
  }

  function getNextDate(dateString, repeat) {
    const date = parseDate(dateString); // Convert 'DD/MM/YYYY' to Date object
    const dayjsDate = dayjs(date);
    let nextDate;
    switch (repeat) {
      case 'day':
        nextDate = dayjsDate.add(1, 'day');
        break;
      case 'week':
        nextDate = dayjsDate.add(1, 'week');
        break;
      case 'month':
        nextDate = dayjsDate.add(1, 'month');
        break;
      default:
        nextDate = dayjsDate; // Fallback if repeat is unrecognized
    }
    return nextDate.format('D/M/YYYY');
  }

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    // console.log(dateString, '\n', day, month, year);
    return new Date(year, month - 1, day); // month - 1 because JS months are 0-based
  };

  const sortEntries = (entries, type, order) => {
    setSort({"type": type, "order": order});
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TransactionsTopBar sortEntries={sortEntries} setFilter={setFilter}/>
    <Box sx={{ ...theme.mixins.toolbar }} />
    <Box>
      {entries
      .filter(entry =>
        Object.entries(filter).every(([key, value]) =>
          value === '' || (key === "date" ? (parseDate(value) - parseDate(entry[key]) < 0) : (value.includes(entry[key])))
        )
      )
      .map((entry, index) => (
        entry.repeat ? (
          <RecurringEntry
            key={index}
            index={index}
            entryValues={entry}
          />
        ) : (
          <ListEntry
            key={index}
            index={index}
            entryValues={entry}
          />
        )
      ))}
      {/* <ListEntry value={"4.10"} currency={"$ USD"} date={"14/09/2021"} category={"Groceries"}/> */}

      <AddListEntryModal open={addListEntryModalOpen} setOpen={setAddListEntryModalOpen} addEntry={addEntry}/>
      <AddRecurringEntryModal open={addRecurringEntryModalOpen} setOpen={setAddRecurringEntryModalOpen} addRecurringEntry={addRecurringEntry}></AddRecurringEntryModal>

      <div className="fixed bottom-20 right-5 z-50">
        {/* <Fab sx={{mr: 2}} color="secondary" aria-label="test" size="small" onClick={() => console.log(recurringEntries)}>
          <EventRepeatIcon />
        </Fab> */}
        <Fab sx={{mr: 2}} color="primary" aria-label="add-recurring" size="medium" onClick={() => setAddRecurringEntryModalOpen(true)}>
          <EventRepeatIcon />
        </Fab>
        <Fab color="primary" aria-label="add" onClick={() => setAddListEntryModalOpen(true)}>
        {/* <Fab color="primary" aria-label="add" onClick={() => console.log(entries)}> */}
          <AddIcon />
        </Fab>
      </div>
      <Navbar />
    </Box>
    </LocalizationProvider>
  );
}
