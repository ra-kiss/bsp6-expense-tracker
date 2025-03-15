'use client';

import { useState } from "react";
import Navbar from "./components/Navbar";
import ListEntry from "./components/ListEntry";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  const [entries, setEntries] = useState([<ListEntry key={0} />]);

  const addEntry = () => {
    setEntries([...entries, <ListEntry key={entries.length} />]);
  };

  return (
    <div>
      {entries}
      <div className="fixed bottom-20 right-5 z-50">
        <Fab color="primary" aria-label="add" onClick={addEntry}>
          <AddIcon />
        </Fab>
      </div>
      <Navbar />
    </div>
  );
}
