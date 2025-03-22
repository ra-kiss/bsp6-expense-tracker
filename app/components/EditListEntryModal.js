import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';

import { DateField } from '@mui/x-date-pickers/DateField';
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
  mb:2
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
}

export default function EditListEntryModal({open, setOpen, entryValues, index}) {
  const { currencies, categories, entries, setEntries } = useGlobal();
  const { value, currency, date, category } = entryValues;
  const handleClose = () => setOpen(false);

  const [valueInput, setValueInput] = useState(value);
  const [currencyInput, setCurrencyInput] = useState(currency);
  const [categoryInput, setCategoryInput] = useState(category);
  
  const [dateInput, setDateInput] = useState(dayjs(parseDate(date)));


  const printValues = () => {
    console.log(valueInput, currencyInput, categoryInput, dateInput);
  }


  const handleChange = (e) => {
    setValueInput(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"));
  };
  
  

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Edit Transaction
          </Typography>
          <Box sx={boxStyle}>
            <TextField id="input-with-sx" label="Value" variant="outlined" type="text" value={valueInput} onChange={handleChange}/>
          </Box>
          <Box sx={boxStyle}>
            <TextField sx={{ mr: 1.5 }} select label="Currency" variant="outlined" value={currencyInput} onChange={(e) => setCurrencyInput(e.target.value)}>
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
            <TextField id="input-with-sx" select label="Category" variant="outlined" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}>
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          <Box sx={boxStyle}>
            <DateField label="Date" value={dateInput} onChange={(value) => setDateInput(value)}/>
          </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button sx={{ ml: 1 }} variant="contained" 
          onClick={() => {
            // printValues();
            // modifyEntry(valueInput, currencyInput, categoryInput, `${dateInput.$D}/${dateInput.$M+1}/${dateInput.$y}`);
            const newEntry = {
              'value': valueInput,
              'currency': currencyInput,
              'category': categoryInput,
              'date': `${dateInput.$D}/${dateInput.$M+1}/${dateInput.$y}`
            }
            setEntries((prevEntries) =>
              prevEntries.map((entry, i) => (i === index ? newEntry : entry))
          );            
          console.log(index, categoryInput, entries);
          handleClose();
        }}>Submit</Button>
          <Button variant="outlined" color="error" 
          onClick={() => {
            // printValues();
            // modifyEntry(valueInput, currencyInput, categoryInput, `${dateInput.$D}/${dateInput.$M+1}/${dateInput.$y}`);
            setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
            handleClose();
            }}>Delete</Button>
        </Box>
        </Box>
      </Modal>
    </div>
  );
}