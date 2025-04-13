import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import { useGlobal } from './GlobalContext';
import dayjs from 'dayjs';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  color: 'black',
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
    setMarkedCategories((prev) =>
      event.target.checked
        ? [...prev, categoryValue] // Add when checked
        : prev.filter((value) => value !== categoryValue) // Remove when unchecked
    );
  };

  const [markedCurrencies, setMarkedCurrencies] = useState([]);

  const handleCurrencyChange = (event, currencyValue) => {
    setMarkedCurrencies((prev) =>
      event.target.checked
        ? [...prev, currencyValue] // Add when checked
        : prev.filter((value) => value !== currencyValue) // Remove when unchecked
    );
  };

  const [timeFilter, setTimeFilter] = useState(null);

  const handleTimeFilterChange = (value) => {
    if (value === timeFilter) {
      setTimeFilter(null);
    } else {
      setTimeFilter(value);
    }
  };

  const clearFilters = () => {
    setTimeFilter(null);
    setMarkedCategories([]);
    setMarkedCurrencies([]);
  }

  const submitFilters = () => {
    // console.log(timeFilter, markedCategories, markedCurrencies);
    let date;
    const today = dayjs();
    if (timeFilter == 'day') {
      const yesterday = today.subtract(1, 'day');
      date = yesterday;
    } else if (timeFilter == 'week') {
      const oneWeekAgo = today.subtract(7, 'day');
      date = oneWeekAgo;
    } else if (timeFilter == 'month') {
      const oneMonthAgo = today.subtract(1, 'month');
      date = oneMonthAgo;
    } else if (timeFilter == 'year') {
      const oneYearAgo = today.subtract(1, 'year');
      date = oneYearAgo;
    } else {
      date = null;
    }
    const dateString = date ? `${date.date()}/${date.month() + 1}/${date.year()}` : '';
    // console.log(dateString);
    setFilter({
      "category": markedCategories.length ? markedCategories : '',
      "currency": markedCurrencies.length ? markedCurrencies : '',
      "date": dateString
    })
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Filter Settings
        </Typography>
        <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
          <FormLabel id="demo-radio-buttons-group-label">By time</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            row
          >
            <FormControlLabel control={<Radio checked={timeFilter === "day"} onClick={() => handleTimeFilterChange("day")}/>} label="Today" />
            <FormControlLabel control={<Radio checked={timeFilter === "week"} onClick={() => handleTimeFilterChange("week")}/>} label="This Week" />
            <FormControlLabel control={<Radio checked={timeFilter === "month"} onClick={() => handleTimeFilterChange("month")}/>} label="This Month" />
            <FormControlLabel control={<Radio checked={timeFilter === "year"} onClick={() => handleTimeFilterChange("year")}/>} label="This Year" />
          </RadioGroup>
        </FormControl>
        {/* <Radio onClick={() => console.log(markedCurrencies)}></Radio> */}
        <Divider variant="middle"/>
        <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
          <FormLabel component="legend">By currencies</FormLabel>
          <FormGroup row>
            {currencies.map((currency) => (
              <FormControlLabel
                key={currency.value}
                control={
                  <Checkbox
                    checked={markedCurrencies.includes(currency.value)}
                    onChange={(event) => handleCurrencyChange(event, currency.value)}
                  />
                }
                label={currency.label}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Divider variant="middle"/>
        <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
          <FormLabel component="legend">By categories</FormLabel>
          <FormGroup row>
            {categories.map((category) => (
              <FormControlLabel
                key={category.value}
                control={
                  <Checkbox
                    checked={markedCategories.includes(category.value)}
                    onChange={(event) => handleCategoryChange(event, category.value)}
                  />
                }
                label={category.label}
              />
            ))}
          </FormGroup>
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