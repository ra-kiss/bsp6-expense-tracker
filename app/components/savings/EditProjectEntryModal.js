import { useState } from 'react';
import ProjectEntryModal from './ProjectEntryModal';
import { useGlobal } from '../GlobalContext';


export default function EditProjectEntryModal({ open, setOpen, entryValues, index }) {
  const { setSavingsProjects } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: entryValues.value,
    currency: entryValues.currency,
    goal: entryValues.goal,
    label: entryValues.label
  };

  const handleSubmit = (entry) => {
    setSavingsProjects((prevEntries) =>
      prevEntries.map((e, i) => (i === index ? entry : e))
    );
  };

  const handleDelete = () => {
    setSavingsProjects((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  return (
    <ProjectEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      onDelete={handleDelete}
    />
  );
}