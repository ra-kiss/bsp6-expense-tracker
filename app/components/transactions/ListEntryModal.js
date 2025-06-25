import { useGlobal } from '../GlobalContext';
import BaseEntryModal from './BaseEntryModal';
import Decimal from 'decimal.js';

export default function ListEntryModal({ open, onClose, onSubmit, initialValues, onDelete, templateAvailable = false }) {
  const { setTemplates } = useGlobal();

  const title = onDelete ? "Edit Transaction" : "Add Transaction";

  const handleSaveAsTemplate = (currentValues) => {
    const template = {
      ...currentValues,
      value: new Decimal(currentValues.value || "0").toFixed(2),
    };
    setTemplates(prev => [...prev, template]);
    onClose();
  };
  
  return (
    <BaseEntryModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialValues={initialValues}
      onDelete={onDelete}
      title={title}
      onSaveAsTemplate={templateAvailable ? handleSaveAsTemplate : null} 
    />
  );
}