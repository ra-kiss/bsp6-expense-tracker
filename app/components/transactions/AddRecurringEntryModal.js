import { useState } from 'react';
import { useGlobal } from '../GlobalContext';
import RecurringEntryModal from './RecurringEntryModal';
import dayjs from 'dayjs';

export default function AddRecurringEntryModal({ open, setOpen, addRecurringEntry }) {
  const { mainCurrency, categories } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: mainCurrency,
    category: categories[0],
    date: dayjs(),
    notes: '',
    repeat: 'day',
    isIncome: false
  };

  const handleSubmit = (entry) => {
    addRecurringEntry(entry.value, entry.currency, entry.category, entry.date, entry.notes, entry.repeat, entry.isIncome);
  };

  return (
    <RecurringEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    />
  );
}