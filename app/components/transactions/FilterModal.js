import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import { useGlobal } from '../GlobalContext';
import dayjs from 'dayjs';


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

const boxStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  mb: 2,
  width: '100%'
};

export default function FilterModal({ open, onClose, setFilter }) {

  const { categories, currencies } = useGlobal();

  const [markedCategories, setMarkedCategories] = useState([]);

  const handleCategoryChange = (event, categoryValue) => {
    setMarkedCategories(categoryValue ? categoryValue : []);
  };

  const [markedCurrencies, setMarkedCurrencies] = useState([]);

  const handleCurrencyChange = (event, currencyValue) => {
    setMarkedCurrencies(currencyValue ? currencyValue : []);
  };

  const [timeFilter, setTimeFilter] = useState('');

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value ? value : '');
  };

  const clearFilters = () => {
    setTimeFilter('');
    setMarkedCategories([]);
    setMarkedCurrencies([]);
  }

  const submitFilters = () => {
    // console.log(timeFilter, markedCategories, markedCurrencies);
    let dateLower;
    let dateUpper;
    const today = dayjs();
    if (timeFilter == 'day') {
      dateLower = today;
      dateUpper = today;
    } else if (timeFilter == 'week') {
      dateLower = today.startOf('week');
      dateUpper = today.endOf('week');
    } else if (timeFilter == '14d') {
      dateLower = today.subtract(14, 'day');
      dateUpper = today;
    } else if (timeFilter == 'month') {
      dateLower = today.startOf('month');
      dateUpper = today.endOf('month');
    } else if (timeFilter == '30d') {
      dateLower = today.subtract(30, 'day');
      dateUpper = today;
    } else if (timeFilter == 'year') {
      dateLower = today.startOf('year');
      dateUpper = today.endOf('year');
    } else {
      dateLower = null;
      dateUpper = null;
    }
    const lowerDateString = dateLower ? dayjs(dateLower).startOf('day').format('D/M/YYYY') : '';
    const upperDateString = dateUpper ? dayjs(dateUpper).startOf('day').format('D/M/YYYY') : '';
    const dateArr = (lowerDateString && upperDateString) ? [lowerDateString, upperDateString] : '';
    console.log(dateLower, dateUpper);
    console.log(lowerDateString, upperDateString, dateArr);
    setFilter({
      "category": markedCategories.length ? markedCategories : '',
      "currency": markedCurrencies.length ? markedCurrencies : '',
      "date": dateArr
    })
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Filter Settings
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="time-select-label">By time</InputLabel>
          <Select
            id="time-select"
            value={timeFilter}
            label="By time"
            onChange={(event) => handleTimeFilterChange(event.target.value)}
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="14d">Last 14 Days</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="">All time</MenuItem>
          </Select>
        </FormControl>
        {/* <Radio onClick={() => console.log(markedCurrencies)}></Radio> */}
        <Divider sx={{ my: 1, opacity: 0 }} variant="middle"/>
        <FormControl fullWidth>
          <InputLabel id="currency-select-label">By currencies</InputLabel>
          <Select
            multiple
            id="currency-select"
            value={markedCurrencies}
            label="By currencies"
            onChange={(event) => handleCurrencyChange(event, event.target.value)}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider sx={{ my: 1, opacity: 0 }} variant="middle"/>
        <FormControl fullWidth>
          <InputLabel id="currency-select-label">By categories</InputLabel>
          <Select
            id="currency-select"
            multiple
            value={markedCategories}
            label="By categories"
            onChange={(event) => handleCategoryChange(event, event.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
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