import { useGlobal } from '../GlobalContext';
import RecurringEntryModal from './RecurringEntryModal';
import dayjs from 'dayjs';

export default function EditRecurringEntryModal({ open, setOpen, entryValues, templateIndex }) {
  const { recurringEntries, setRecurringEntries } = useGlobal();
  const handleClose = () => setOpen(false);

  const initialValues = {
    value: entryValues.value || '',
    currency: entryValues.currency || '',
    category: entryValues.category || '',
    date: dayjs(entryValues.date, 'D/M/YYYY'),
    notes: entryValues.notes || '',
    repeat: entryValues.repeat || 'day',
    isIncome: entryValues.isIncome || false
  };

  const handleSubmit = (entry) => {
    const updatedEntries = [...recurringEntries];
    updatedEntries[templateIndex] = {
      ...entry,
      isRecurring: true,
      templateIndex
    };
    setRecurringEntries(updatedEntries);
  };

  const handleDelete = () => {
    setRecurringEntries(recurringEntries.filter((_, index) => index !== templateIndex));
  };

  return (
    <RecurringEntryModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      onDelete={handleDelete}
    />
  );
}