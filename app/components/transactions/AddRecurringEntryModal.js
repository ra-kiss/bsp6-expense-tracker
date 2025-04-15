import { useState } from 'react';
import RecurringEntryModal from './RecurringEntryModal';
import dayjs from 'dayjs';

export default function AddRecurringEntryModal({ open, setOpen, addRecurringEntry }) {
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: '$ USD',
    category: 'Other',
    date: dayjs(),
    notes: '',
    repeat: 'day'
  };

  const handleSubmit = (entry) => {
    addRecurringEntry(entry.value, entry.currency, entry.category, entry.date, entry.notes, entry.repeat);
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