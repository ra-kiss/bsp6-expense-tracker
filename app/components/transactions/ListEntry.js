'use client';

import { useState } from "react";
import Typography from '@mui/material/Typography';
import { useGlobal } from '../GlobalContext';
import NotesIcon from '@mui/icons-material/Notes';
import EditListEntryModal from "./EditListEntryModal";
import BaseEntryCard from "../BaseEntryCard"; 

export default function ListEntry({ index, entryValues, showDate = true }) {
  const { value, currency, date, category, notes, isIncome } = entryValues;
  const { currencies } = useGlobal();
  const [editListEntryModalOpen, setEditListEntryModalOpen] = useState(false);

  const currencyLabel = currencies.find(c => c.value === currency)?.label || '';

  return (
    <>
      <EditListEntryModal
        open={editListEntryModalOpen}
        setOpen={setEditListEntryModalOpen}
        entryValues={entryValues}
        index={index}
      />
      <BaseEntryCard onClick={() => setEditListEntryModalOpen(true)}>
        {/* All unique content goes here */}
        <Typography sx={{ fontWeight: "bold", fontSize: 20, color: isIncome ? 'success.main' : 'error.main' }} component="div">
          {isIncome ? "+" : "-"}{value}{currencyLabel}
        </Typography>
        <div>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            {showDate ? `${date} - ${category}` : category}
          </Typography>
        </div>
        {notes && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <NotesIcon sx={{ fontSize: 'small', color: 'text.secondary' }} />
            <Typography sx={{ ml: 1, color: 'text.secondary', fontSize: 14 }}>
              {notes}
            </Typography>
          </div>
        )}
      </BaseEntryCard>
    </>
  );
}