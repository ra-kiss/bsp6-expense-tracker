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

export default function FilterModal({ open, onClose, setFilter, title = 'Filter Settings', filters }) {
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.initialValue || '' }), {})
  );

  const handleChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value || (filter.multiple ? [] : '') }));
  };

  const clearFilters = () => {
    setFilterValues(
      filters.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.initialValue || '' }), {})
    );
  };

  const submitFilters = () => {
    setFilter(filterValues);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {filters.map((filter, index) => (
          <Box key={filter.key}>
            <FormControl fullWidth>
              <InputLabel id={`${filter.key}-select-label`}>{filter.label}</InputLabel>
              <Select
                id={`${filter.key}-select`}
                value={filterValues[filter.key]}
                label={filter.label}
                multiple={filter.multiple || false}
                onChange={(event) => handleChange(filter.key, event.target.value)}
              >
                {filter.options.map((option) => (
                  <MenuItem
                    key={typeof option === 'string' ? option : option.value}
                    value={typeof option === 'string' ? option : option.value}
                  >
                    {typeof option === 'string' ? option : option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {index < filters.length - 1 && (
              <Divider sx={{ my: 1, opacity: 0 }} variant="middle" />
            )}
          </Box>
        ))}
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