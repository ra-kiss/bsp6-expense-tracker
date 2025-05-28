import { useState } from 'react';
import { useGlobal } from '../GlobalContext';
import ListEntryModal from './ListEntryModal';
import dayjs from 'dayjs';

export default function AddListEntryModal({ open, setOpen, addEntry }) {
  const { mainCurrency, categories } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: mainCurrency,
    category: categories[0],
    date: dayjs(),
    notes: '',
    isIncome: false
  };

  const handleSubmit = (entry) => {
    addEntry(entry.value, entry.currency, entry.category, entry.date, entry.notes, entry.isIncome);
  };

  return (
    <ListEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      templateAvailable={true}
    />
  );
}