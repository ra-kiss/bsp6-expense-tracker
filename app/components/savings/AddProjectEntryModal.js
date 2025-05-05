import { useState } from 'react';
import ProjectEntryModal from './ProjectEntryModal';
import { useGlobal } from "../GlobalContext";

export default function AddProjectEntryModal({ open, setOpen, addEntry }) {
  const { mainCurrency } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: '',
    currency: mainCurrency,
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