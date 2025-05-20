import { useState } from 'react';
import CurrencyEntryModal from './CurrencyEntryModal';
import { useGlobal } from "../GlobalContext";

export default function AddCurrencyEntryModal({ open, setOpen, addEntry }) {
  const { } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    label: '',
    exchangeRate: ''
  };

  const handleSubmit = (entry) => {
    addEntry(entry.label, entry.exchangeRate);
  };

  return (
    <CurrencyEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    />
  );
}