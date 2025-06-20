import { useState, useEffect } from 'react';
import BaseEntryModal from './BaseEntryModal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function RecurringEntryModal({ open, onClose, onSubmit, initialValues, onDelete }) {
  const [repeatInput, setRepeatInput] = useState('');

  useEffect(() => {
    if (open) {
      setRepeatInput(initialValues.repeat || 'month'); // Default to monthly
    }
  }, [open, initialValues]);

  const title = onDelete ? "Edit Recurring Transaction" : "Add Recurring Transaction";

  // Wrap the original onSubmit to add the 'repeat' field
  const handleRecurringSubmit = (baseEntry) => {
    const entryWithRepeat = {
      ...baseEntry,
      repeat: repeatInput,
    };
    onSubmit(entryWithRepeat);
  };

  return (
    <BaseEntryModal
    open={open}
    onClose={onClose}
    onSubmit={handleRecurringSubmit} // Pass our wrapped submit handler
    initialValues={initialValues}
    onDelete={onDelete}
    title={title}
    >
      {/* This Box is passed down as children to the BaseEntryModal */}
      <Box sx={{ mb: 2, width: '100%' }}>
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
    </BaseEntryModal>
  );
}