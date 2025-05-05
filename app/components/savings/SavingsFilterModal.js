'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import { useGlobal } from '../GlobalContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SavingsFilterModal({ open, onClose, setFilter }) {
  const { currencies } = useGlobal();
  const [markedCurrencies, setMarkedCurrencies] = useState([]);
  const [completionFilter, setCompletionFilter] = useState('');

  const handleCurrencyChange = (event) => {
    setMarkedCurrencies(event.target.value || []);
  };

  const handleCompletionFilterChange = (event) => {
    setCompletionFilter(event.target.value || '');
  };

  const clearFilters = () => {
    setMarkedCurrencies([]);
    setCompletionFilter('');
  };

  const submitFilters = () => {
    setFilter({
      currency: markedCurrencies.length ? markedCurrencies : '',
      completion: completionFilter
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Filter Settings
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="currency-select-label">By currencies</InputLabel>
          <Select
            multiple
            id="currency-select"
            value={markedCurrencies}
            label="By currencies"
            onChange={handleCurrencyChange}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider sx={{ my: 1, opacity: 0 }} variant="middle" />
        <FormControl fullWidth>
          <InputLabel id="completion-select-label">By completion</InputLabel>
          <Select
            id="completion-select"
            value={completionFilter}
            label="By completion"
            onChange={handleCompletionFilterChange}
          >
            <MenuItem value="complete">Complete</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'row-reverse' }}>
          <Button variant="contained" onClick={submitFilters}>
            Submit
          </Button>
          <Button sx={{ mr: 2 }} variant="outlined" color="error" onClick={clearFilters}>
            Clear
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}