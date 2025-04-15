import { useState } from 'react';
import ProjectEntryModal from './ProjectEntryModal';
import dayjs from 'dayjs';

export default function AddProjectEntryModal({ open, setOpen, addEntry }) {
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: '$ USD',
    goal: '',
    label: ''
  };

  const handleSubmit = (entry) => {
    addEntry(entry.value, entry.currency, entry.goal, entry.label);
  };

  return (
    <ProjectEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    />
  );
}