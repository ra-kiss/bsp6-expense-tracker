import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobal } from '../GlobalContext';
import ListEntry from './ListEntry'; 
import dayjs from 'dayjs';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enables scrolling if list is long
};

export default function TemplateListModal({ open, onClose, addEntry }) {
  const { templates, setTemplates } = useGlobal();

  const handleDeleteTemplate = (index) => {
    setTemplates(templates.filter((_, i) => i !== index));
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="template-list-title">
      <Box sx={modalStyle}>
        <Typography id="template-list-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Saved Templates
        </Typography>

        {templates.length === 0 ? (
          <Typography>No templates saved yet.</Typography>
        ) : (
          templates.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'stretch', mb: 1 }}>
              <Box
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => {
                  const today = dayjs().format('D/M/YYYY');
                  addEntry(entry.value, entry.currency, entry.category, today, entry.notes);
                  onClose();
                }}
              >
                <ListEntry index={index} entryValues={entry} showDate={false} />
              </Box>
              <IconButton
                onClick={() => handleDeleteTemplate(index)}
                aria-label={`Delete template ${index + 1}`}
                sx={{ alignSelf: 'stretch' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}