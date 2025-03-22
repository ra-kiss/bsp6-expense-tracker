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

export default function AddListEntryModal({open, setOpen, addEntry}) {
  const { currencies, categories } = useGlobal();
  const handleClose = () => setOpen(false);

  const [valueInput, setValueInput] = useState("0");
  const [currencyInput, setCurrencyInput] = useState("$ USD");
  const [categoryInput, setCategoryInput] = useState("Other");
  const [dateInput, setDateInput] = useState(dayjs());

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
            Add Transaction
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
          <Button variant="contained" 
          onClick={() => {
              // printValues();
              addEntry(valueInput, currencyInput, categoryInput, `${dateInput.$D}/${dateInput.$M+1}/${dateInput.$y}`);
              handleClose();
            }}>Submit</Button>
        </Box>
        </Box>
      </Modal>
    </div>
  );
}