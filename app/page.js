'use client';

import { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { useTheme } from '@mui/material/styles';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Navbar from "./components/Navbar";
import ListEntry from "./components/ListEntry";
import AddListEntryModal from "./components/AddListEntryModal";
import TransactionsTopBar from './components/TransactionsTopBar';
import { useGlobal } from './components/GlobalContext';



export default function Home() {
  const theme = useTheme();
  const { entries, setEntries } = useGlobal();
  const [sort, setSort] = useState({"type": 'recency', "order": 'desc'});
  const [addListEntryModalOpen, setAddListEntryModalOpen] = useState(false);

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

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    console.log(dateString, '\n', day, month, year);
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
        <ListEntry
          key={index}
          index={index}
          open={addListEntryModalOpen}
          setOpen={setAddListEntryModalOpen}
          entryValues={entry}
        />
      ))}
      {/* <ListEntry value={"4.10"} currency={"$ USD"} date={"14/09/2021"} category={"Groceries"}/> */}

      <AddListEntryModal open={addListEntryModalOpen} setOpen={setAddListEntryModalOpen} addEntry={addEntry}/>

      <div className="fixed bottom-20 right-5 z-50">
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
