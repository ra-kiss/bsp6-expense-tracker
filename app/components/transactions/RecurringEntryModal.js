import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useGlobal } from '../GlobalContext';
import Decimal from 'decimal.js';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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

export default function RecurringEntryModal({ open, onClose, onSubmit, initialValues, onDelete }) {
  const { currencies, categories } = useGlobal();

  const [valueInput, setValueInput] = useState(initialValues.value);
  const [currencyInput, setCurrencyInput] = useState(initialValues.currency);
  const [categoryInput, setCategoryInput] = useState(initialValues.category);
  const [dateInput, setDateInput] = useState(initialValues.date);
  const [notesInput, setNotesInput] = useState(initialValues.notes);
  const [repeatInput, setRepeatInput] = useState(initialValues.repeat);
  const [isIncome, setIsIncome] = useState(initialValues.isIncome ?? false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setValueInput(initialValues.value);
      setCurrencyInput(initialValues.currency);
      setCategoryInput(initialValues.category);
      setDateInput(initialValues.date);
      setNotesInput(initialValues.notes);
      setRepeatInput(initialValues.repeat);
    }
  }, [open, initialValues]);

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Numbers and decimal only
    if (value.includes(".")) {
      let [dollars, cents] = value.split(".");
      cents = cents.slice(0, 2); // Max two decimal places
      value = dollars + "." + cents;
    }
    setValueInput(value);
  };

  const handleSubmit = () => {
    const formattedValue = new Decimal(valueInput || "0").toFixed(2);
    const dateString = `${dateInput.$D}/${dateInput.$M + 1}/${dateInput.$y}`;
    const entry = {
      value: formattedValue,
      currency: currencyInput,
      category: categoryInput,
      date: dateString,
      notes: notesInput,
      repeat: repeatInput,
      isIncome: isIncome
    };
    onSubmit(entry);
    onClose();
  };

  // Determine title and whether to show delete button based on onDelete prop
  const title = onDelete ? "Edit Recurring Transaction" : "Add Recurring Transaction";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={boxStyle}>
          <TextField
            label="Value"
            variant="outlined"
            type="text"
            value={valueInput}
            onChange={handleChange}
            sx={{ width: '100%' }} // Stretch to full width
          />
        </Box>
        <Box sx={{ ...boxStyle, justifyContent: 'space-between' }}> {/* Space out Currency and Category */}
          <TextField
            select
            label="Currency"
            variant="outlined"
            value={currencyInput}
            onChange={(e) => setCurrencyInput(e.target.value)}
            sx={{ width: '48%' }} // Nearly half width each
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Category"
            variant="outlined"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            sx={{ width: '48%' }} // Nearly half width each
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ ...boxStyle, justifyContent: 'space-between', alignItems: 'center' }}>
          <DateField
            label="Date"
            value={dateInput}
            onChange={(value) => setDateInput(value)}
            sx={{ width: '48%' }} 
          />
          <Button
            variant="outlined"
            color={isIncome ? 'success' : 'error'}
            onClick={() => setIsIncome(!isIncome)}
            sx={{
              width: '48%',
              height: '4em'
            }}
          >
            {isIncome ? 'Income' : 'Expense'}
          </Button>
        </Box>
        <Box sx={boxStyle}>
          <TextField
            select
            label="Repeat"
            variant="outlined"
            value={repeatInput}
            onChange={(e) => setRepeatInput(e.target.value)}
            sx={{ width: '100%' }}
          >
            <MenuItem value="day">Every Day</MenuItem>
            <MenuItem value="week">Every 7 Days</MenuItem>
            <MenuItem value="month">Every 30 Days</MenuItem>
            <MenuItem value="year">Every Year</MenuItem>
          </TextField>
        </Box>
        <Box sx={boxStyle}>
          <TextField
            label="Notes"
            variant="outlined"
            multiline
            minRows={2}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            sx={{ width: '100%' }} // Stretch to full width
          />
        </Box>
        {/* <FormControl component="fieldset" variant="standard">
          <FormLabel id="demo-radio-buttons-group-label">By time</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            row
          >
            <FormControlLabel control={<Radio checked={repeat === "day"} onClick={() => handleRepeatChange("day")}/>} label="Today" />
            <FormControlLabel control={<Radio checked={repeat === "week"} onClick={() => handleRepeatChange("week")}/>} label="This Week" />
            <FormControlLabel control={<Radio checked={repeat === "month"} onClick={() => handleRepeatChange("month")}/>} label="This Month" />
            <FormControlLabel control={<Radio checked={repeat === "year"} onClick={() => handleRepeatChange("year")}/>} label="This Year" />
          </RadioGroup>
        </FormControl> */}
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          {onDelete && (
            <Button
              sx={{ mr: 1 }}
              variant="outlined"
              color="error"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}