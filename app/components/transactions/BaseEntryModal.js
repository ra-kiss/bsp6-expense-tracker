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

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4,
};

const boxStyle = {
  display: 'flex', alignItems: 'flex-end', mb: 2, width: '100%'
};

export default function BaseEntryModal({ open, onClose, onSubmit, initialValues, onDelete, title, children, onSaveAsTemplate }) {
  const { currencies, categories } = useGlobal();

  const [valueInput, setValueInput] = useState('');
  const [currencyInput, setCurrencyInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [dateInput, setDateInput] = useState(null);
  const [notesInput, setNotesInput] = useState('');
  const [isIncome, setIsIncome] = useState(false);

  useEffect(() => {
    if (open) {
      setValueInput(initialValues.value || '');
      setCurrencyInput(initialValues.currency || '');
      setCategoryInput(initialValues.category || '');
      setDateInput(initialValues.date || null);
      setNotesInput(initialValues.notes || '');
      setIsIncome(initialValues.isIncome ?? false);
    }
  }, [open, initialValues]);

  const handleValueChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      value = parts.join(".");
    }
    setValueInput(value);
  };
  
  const getCurrentValues = () => ({
    value: valueInput,
    currency: currencyInput,
    category: categoryInput,
    date: dateInput,
    notes: notesInput,
    isIncome: isIncome,
  });

  const handleSubmit = () => {
    const currentValues = getCurrentValues();
    const baseEntry = {
      ...currentValues,
      value: new Decimal(currentValues.value || "0").toFixed(2),
      date: currentValues.date ? `${currentValues.date.$D}/${currentValues.date.$M + 1}/${currentValues.date.$y}` : '',
    };
    onSubmit(baseEntry);
    onClose();
  };

  const handleSaveTemplateClick = () => {
    const currentValues = getCurrentValues();
    onSaveAsTemplate(currentValues);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Box sx={boxStyle}>
          <TextField label="Value" variant="outlined" type="text" value={valueInput} onChange={handleValueChange} sx={{ width: '100%' }}/>
        </Box>
        <Box sx={{ ...boxStyle, justifyContent: 'space-between' }}>
          <TextField select label="Currency" variant="outlined" value={currencyInput} onChange={(e) => setCurrencyInput(e.target.value)} sx={{ width: '48%' }}>
            {currencies.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
          </TextField>
          <TextField select label="Category" variant="outlined" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} sx={{ width: '48%' }}>
            {categories.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </TextField>
        </Box>
        <Box sx={{...boxStyle, justifyContent: 'space-between', alignItems: 'center'}}>
          <DateField label="Date" value={dateInput} onChange={setDateInput} sx={{ width: '48%' }} />
          <Button variant="outlined" color={isIncome ? 'success' : 'error'} onClick={() => setIsIncome(!isIncome)} sx={{ width: '48%', height: '4em' }}>
            {isIncome ? 'Income' : 'Expense'}
          </Button>
        </Box>

        {children}

        <Box sx={boxStyle}>
          <TextField label="Notes" variant="outlined" multiline minRows={2} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} sx={{ width: '100%' }} />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', gap: 1 }}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          {onSaveAsTemplate && (
            <Button variant="outlined" color="primary" onClick={handleSaveTemplateClick}>
              Save as Template
            </Button>
          )}
          {onDelete && (
            <Button variant="outlined" color="error" onClick={() => { onDelete(); onClose(); }}>
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}