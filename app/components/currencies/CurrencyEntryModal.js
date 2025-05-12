import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useGlobal } from '../GlobalContext';
import Decimal from 'decimal.js';

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

export default function CurrencyEntryModal({ open, onClose, onSubmit, initialValues, onDelete }) {
  const [labelInput, setLabelInput] = useState(initialValues.label || '');
  const [exchangeRateInput, setExchangeRateInput] = useState(initialValues.exchangeRate || '');

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setLabelInput(initialValues.label || '');
      setExchangeRateInput(initialValues.exchangeRate || '');
    }
  }, [open, initialValues]);

  const handleChange = (e, setValue) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Numbers and decimal only
    if (value.includes(".")) {
      let [whole, decimal] = value.split(".");
      decimal = decimal.slice(0, 2); // Max two decimal places
      value = whole + "." + decimal;
    }
    setValue(value);
  };

  const handleSubmit = () => {
    const formattedExchangeRate = new Decimal(exchangeRateInput ? exchangeRateInput : "0").toFixed(2);
    const entry = {
      label: labelInput ? labelInput : "Unnamed Currency",
      exchangeRate: formattedExchangeRate
    };
    onSubmit(entry);
    onClose();
  };

  // Determine title and whether to show delete button based on onDelete prop
  const title = onDelete ? "Edit Currency" : "Add Currency";

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
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={boxStyle}>
          <TextField
            label="Exchange Rate"
            variant="outlined"
            type="text"
            value={exchangeRateInput}
            onChange={(e) => handleChange(e, setExchangeRateInput)}
            sx={{ width: '100%' }}
          />
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