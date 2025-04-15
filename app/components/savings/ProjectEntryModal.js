import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import { useGlobal } from '../GlobalContext';
import Decimal from 'decimal.js';
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

export default function ProjectEntryModal({ open, onClose, onSubmit, initialValues, onDelete }) {
  const { currencies } = useGlobal();
  // value, currency, goal, label

  const [valueInput, setValueInput] = useState(initialValues.value);
  const [currencyInput, setCurrencyInput] = useState(initialValues.currency);
  const [goalInput, setGoalInput] = useState(initialValues.goal);
  const [labelInput, setLabelInput] = useState(initialValues.label);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setValueInput(initialValues.value);
      setCurrencyInput(initialValues.currency);
      setGoalInput(initialValues.goal);
      setLabelInput(initialValues.label);
    }
  }, [open, initialValues]);

  const handleChange = (e, setValue) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Numbers and decimal only
    if (value.includes(".")) {
      let [dollars, cents] = value.split(".");
      cents = cents.slice(0, 2); // Max two decimal places
      value = dollars + "." + cents;
    }
    setValue(value);
  };

  const handleSubmit = () => {
    const formattedValue = new Decimal(valueInput || "0").toFixed(2);
    const formattedGoal = new Decimal(goalInput || "0").toFixed(2);
    const entry = {
      value: formattedValue,
      currency: currencyInput,
      goal: formattedGoal,
      label: labelInput
    };
    onSubmit(entry);
    onClose();
  };

  // Determine title and whether to show delete button based on onDelete prop
  const title = onDelete ? "Edit Savings Project" : "Add Savings Project";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={boxStyle}>
          <TextField
            label="Label"
            variant="outlined"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            sx={{ width: '100%' }} // Stretch to full width
          />
        </Box>
        <Box sx={{ ...boxStyle, justifyContent: 'space-between' }}> {/* Space out Currency and Category */}
          <TextField
            label="Value"
            variant="outlined"
            type="text"
            value={valueInput}
            onChange={(e) => handleChange(e, setValueInput)}
            sx={{ width: '48%' }} // Stretch to full width
          />
          <TextField
            label="Goal"
            variant="outlined"
            type="text"
            value={goalInput}
            onChange={(e) => handleChange(e, setGoalInput)}
            sx={{ width: '48%' }}
          />
        </Box>
        <Box sx={boxStyle}>
          <TextField
            select
            label="Currency"
            variant="outlined"
            value={currencyInput}
            onChange={(e) => setCurrencyInput(e.target.value)}
            sx={{ width: '100%' }} // Nearly half width each
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
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