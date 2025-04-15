import { useState } from 'react';
import ListEntryModal from './ListEntryModal';
import dayjs from 'dayjs';

export default function AddListEntryModal({ open, setOpen, addEntry }) {
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: '$ USD',
    category: 'Other',
    date: dayjs(),
    notes: ''
  };

  const handleSubmit = (entry) => {
    addEntry(entry.value, entry.currency, entry.category, entry.date, entry.notes, entry.date);
  };

  return (
    <ListEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    />
  );
}