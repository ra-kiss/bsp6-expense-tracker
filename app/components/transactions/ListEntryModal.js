import { useGlobal } from '../GlobalContext';
import BaseEntryModal from './BaseEntryModal';
import Button from '@mui/material/Button';
import Decimal from 'decimal.js';

export default function ListEntryModal({ open, onClose, onSubmit, initialValues, onDelete, templateAvailable = false }) {
  const { setTemplates } = useGlobal();

  const title = onDelete ? "Edit Transaction" : "Add Transaction";

  const handleSaveAsTemplate = () => {

    const template = {
      ...initialValues,
      value: new Decimal(initialValues.value || "0").toFixed(2),
    };
    setTemplates(prev => [...prev, template]);
    onClose();
  };

  const customActions = templateAvailable ? (
    <Button variant="outlined" color="primary" onClick={handleSaveAsTemplate}>
      Save as Template
    </Button>
  ) : null;
  
  return (
    <BaseEntryModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialValues={initialValues}
      onDelete={onDelete}
      title={title}
      customActions={customActions} 
    />
  );
}