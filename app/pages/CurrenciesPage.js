'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import CurrenciesTopBar from '../components/currencies/CurrenciesTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useGlobal } from '../components/GlobalContext';
import CurrencyEntry from "../components/currencies/CurrencyEntry";
import AddCurrencyEntryModal from '../components/currencies/AddCurrencyEntryModal';
import EditCurrencyEntryModal from '../components/currencies/EditCurrencyEntryModal';
import CurrenciesFilterModal from '../components/currencies/CurrenciesFilterModal';

export default function CurrenciesPage() {
  const theme = useTheme();
  const { currencies, setCurrencies, exchangeRates, setExchangeRates, saveDataToLocal } = useGlobal();
  const [addCurrencyModalOpen, setAddCurrencyModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editCurrencyModalOpen, setEditCurrencyModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState({ customStatus: '' });

  // Map currencies to entryValues objects with filtering
  const currencyEntries = currencies
    .map(currency => ({
      label: currency.label,
      valueInMain: exchangeRates[currency.value] || 0,
      custom: !!currency.custom
    }))
    .filter(entry => {
      if (!filter.customStatus) return true; // Show all if no filter
      return filter.customStatus === 'custom' ? entry.custom : !entry.custom;
    });

  const addCurrency = (label, exchangeRate) => {
    const value = label.replace(/\s/g, '').toUpperCase().slice(0, 10); // Generate unique value
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

  return (
    <>
      <CurrenciesTopBar setFilterModalOpen={setFilterModalOpen} />
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        {currencyEntries.length > 0 ? (
          currencyEntries.map((entry, index) => (
            <CurrencyEntry
              key={index}
              index={index}
              entryValues={entry}
              onClick={entry.custom ? () => {
                setEditIndex(index);
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
          entryValues={currencyEntries[editIndex] || {}}
          index={editIndex}
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
          {/* <Fab onClick={() => saveDataToLocal() }></Fab> */}
        </div>
        <Box sx={{mt: 8}}/>
      </Box>
    </>
  );
}