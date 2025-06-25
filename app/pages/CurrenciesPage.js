'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import GenericTopBar from '../components/GenericTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useGlobal } from '../components/GlobalContext';
import CurrencyEntry from "../components/currencies/CurrencyEntry";
import AddCurrencyEntryModal from '../components/currencies/AddCurrencyEntryModal';
import EditCurrencyEntryModal from '../components/currencies/EditCurrencyEntryModal';
import CurrenciesFilterModal from '../components/currencies/CurrenciesFilterModal';
import Alert from '@mui/material/Alert';
import fx from 'money';

const formatDisplayValue = (value) => {
  // Check if value is a valid number and is 0.01 or greater
  if (typeof value !== 'number' || isNaN(value) || value < 0.01) {
    return '<0.01';
  }
  // If valid, format to 2 decimal places (which returns a string)
  return value.toFixed(2);
};

export default function CurrenciesPage() {
  const theme = useTheme();
  const { currencies, setCurrencies, exchangeRates, setExchangeRates, showWarning, mainCurrency } = useGlobal();
  const [addCurrencyModalOpen, setAddCurrencyModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editCurrencyModalOpen, setEditCurrencyModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState({ customStatus: '' });

  const currencyEntries = useMemo(() => {
    if (!mainCurrency || !exchangeRates) {
      return [];
    }

    fx.base = mainCurrency;
    fx.rates = exchangeRates;

    return currencies
      .map(currency => {
        const hasRate = exchangeRates[currency.value] !== undefined;
        // Calculate the raw numeric value, or null if not possible
        const rawValue = hasRate ? fx.convert(1, { from: mainCurrency, to: currency.value }) : null;

        return {
          label: currency.label,
          oneMainValue: formatDisplayValue(rawValue),
          custom: !!currency.custom,
          value: currency.value,
        };
      })
      .filter(entry => {
        if (!filter.customStatus) return true;
        return filter.customStatus === 'custom' ? entry.custom : !entry.custom;
      });
  }, [currencies, exchangeRates, mainCurrency, filter]);

  const addCurrency = (label, exchangeRate) => {
    const value = label.replace(/\s/g, '').toUpperCase().slice(0, 10);
    const newCurrency = {
      value,
      label,
      custom: true
    };
    setCurrencies([newCurrency, ...currencies]);
    setExchangeRates({
      ...exchangeRates,
      [value]: parseFloat(exchangeRate) || 0
    });
  };

  const entryToEdit = editIndex !== null ? currencyEntries.find(entry => entry.value === editIndex) : {};

  return (
    <>
      <GenericTopBar title="Currencies" showFilter onFilterClick={() => setFilterModalOpen(true)} />
      <Box sx={{ ...theme.mixins.toolbar }} />
          {showWarning && (
            <Box sx={{p:1}}>
              <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 10 }}>
                Warning: Based on your current spending rate, you may not have enough budget to meet your savings goals.
              </Alert>
            </Box>
          )}
      <Box>
        {currencyEntries.length > 0 ? (
          currencyEntries.map((entry) => (
            <CurrencyEntry
              key={entry.value}
              entryValues={entry}
              onClick={entry.custom ? () => {
                setEditIndex(entry.value);
                setEditCurrencyModalOpen(true);
              } : undefined}
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            No currencies found.
          </Box>
        )}
        <AddCurrencyEntryModal
          open={addCurrencyModalOpen}
          setOpen={setAddCurrencyModalOpen}
          addEntry={addCurrency}
        />
        <EditCurrencyEntryModal
          open={editCurrencyModalOpen}
          setOpen={setEditCurrencyModalOpen}
          entryValues={entryToEdit || {}}
          editValue={editIndex}
        />
        <CurrenciesFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          setFilter={setFilter}
        />
        <div className="fixed bottom-20 right-5 z-50">
          <Fab color="primary" aria-label="add" onClick={() => setAddCurrencyModalOpen(true)}>
            <AddIcon />
          </Fab>
        </div>
        <Box sx={{mt: 8}}/>
      </Box>
    </>
  );
}