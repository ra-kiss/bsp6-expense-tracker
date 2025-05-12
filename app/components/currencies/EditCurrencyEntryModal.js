import { useState } from 'react';
import CurrencyEntryModal from './CurrencyEntryModal';
import { useGlobal } from '../GlobalContext';

export default function EditCurrencyEntryModal({ open, setOpen, entryValues, index }) {
  const { currencies, setCurrencies, exchangeRates, setExchangeRates } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    label: entryValues.label,
    exchangeRate: entryValues.valueInMain
  };

  const handleSubmit = (entry) => {
    const newValue = entry.label.replace(/\s/g, '').toUpperCase().slice(0, 10); // Generate unique value
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency, i) =>
        i === index ? { ...currency, value: newValue, label: entry.label } : currency
      )
    );
    setExchangeRates((prevRates) => {
      const { [currencies[index].value]: _, ...rest } = prevRates; // Remove old value
      return { ...rest, [newValue]: parseFloat(entry.exchangeRate) || 0 };
    });
  };

  const handleDelete = () => {
    const currencyValue = currencies[index].value;
    setCurrencies((prevCurrencies) => prevCurrencies.filter((_, i) => i !== index));
    setExchangeRates((prevRates) => {
      const { [currencyValue]: _, ...rest } = prevRates;
      return rest;
    });
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