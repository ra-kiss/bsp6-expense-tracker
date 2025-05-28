import { useState } from 'react';
import ListEntryModal from './ListEntryModal';
import { useGlobal } from '../GlobalContext';
import dayjs from 'dayjs';

function parseDate(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export default function EditListEntryModal({ open, setOpen, entryValues, index }) {
  const { setEntries } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: entryValues.value,
    currency: entryValues.currency,
    category: entryValues.category,
    date: dayjs(parseDate(entryValues.date)),
    notes: entryValues.notes,
    isIncome: entryValues.isIncome
  };

  const handleSubmit = (entry) => {
    setEntries((prevEntries) =>
      prevEntries.map((e, i) => (i === index ? entry : e))
    );
  };

  const handleDelete = () => {
    setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  return (
    <ListEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      onDelete={handleDelete}
    />
  );
}