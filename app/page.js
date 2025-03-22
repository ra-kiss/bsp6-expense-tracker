'use client';

import { useState } from "react";
import Navbar from "./components/Navbar";
import ListEntry from "./components/ListEntry";
import AddListEntryModal from "./components/AddListEntryModal";
import { useGlobal } from './components/GlobalContext';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  // const [entries, setEntries] = useState([]);
  const { entries, setEntries } = useGlobal();
  const [addListEntryModalOpen, setAddListEntryModalOpen] = useState(false);

  const addEntry = (value, currency, category, date) => {
    let curValue = value ? value : 0;
    let entryValues = {
      'value': curValue,
      'currency': currency,
      'category': category,
      'date': date
    }
    setEntries([entryValues, ...entries]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      {entries.map((entry, index) => (
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
          <AddIcon />
        </Fab>
      </div>
      <Navbar />
    </div>
    </LocalizationProvider>
  );
}
