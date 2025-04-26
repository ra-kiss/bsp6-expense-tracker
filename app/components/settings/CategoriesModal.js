import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useGlobal } from '../GlobalContext';

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
  maxHeight: 300, 
  overflowY: 'auto',
  maxWidth: '100%', 
  width: '100%',
  mb:2
};

export default function CategoriesModal({ open, onClose }) {
  const { categories, setCategories } = useGlobal();

  const [newCategoryInput, setNewCategoryInput] = useState('');

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory])
  }

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter((category) => category !== categoryToDelete));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Add/Remove Categories
        </Typography>
        <Box sx={boxStyle}>
          {categories.map((category) => (
            <Box
              key={category}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
              }}
            >
              <Typography variant="body1">{category}</Typography>
              <IconButton
                onClick={() => handleDeleteCategory(category)}
                aria-label={`Delete ${category}`}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            label="New Category"
            variant="standard"
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            sx={{ width: '100%' }} // Stretch to full width
          />
          <Button variant="contained" endIcon={<AddIcon/>} onClick={() => handleAddCategory(newCategoryInput)} sx={{ alignSelf: 'flex-end' }}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}