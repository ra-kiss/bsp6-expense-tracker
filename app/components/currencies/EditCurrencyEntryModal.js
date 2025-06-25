import { useState } from 'react';
import CurrencyEntryModal from './CurrencyEntryModal';
import { useGlobal } from '../GlobalContext';

export default function EditCurrencyEntryModal({ open, setOpen, entryValues, editValue }) {
  const { currencies, setCurrencies, setExchangeRates } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    label: entryValues.label,
    exchangeRate: entryValues.oneMainValue
  };

  const handleSubmit = (entry) => {
    const newValue = entry.label.replace(/\s/g, '').toUpperCase().slice(0, 10); // Generate unique value
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency) =>
        currency.value === editValue
          ? { ...currency, value: newValue, label: entry.label }
          : currency
      )
    );
    setExchangeRates((prevRates) => {
      const { [editValue]: _, ...rest } = prevRates; // Remove old value using its key
      return { ...rest, [newValue]: parseFloat(entry.exchangeRate) || 0 };
    });

    handleClose();
  };

  const handleDelete = () => {
    if (!editValue) return; // Safety check

    setCurrencies((prevCurrencies) =>
      prevCurrencies.filter((currency) => currency.value !== editValue)
    );

    setExchangeRates((prevRates) => {
      const { [editValue]: _, ...rest } = prevRates;
      return rest;
    });

    handleClose();
  };

  return (
    <CurrencyEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      onDelete={handleDelete}
    />
  );
}