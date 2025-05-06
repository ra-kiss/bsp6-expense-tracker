'use client';

import FilterModal from '../FilterModal';
import { useGlobal } from '../GlobalContext';

export default function SavingsFilterModal({ open, onClose, setFilter }) {
  const { currencies } = useGlobal();

  const filters = [
    {
      key: 'currency',
      label: 'By currencies',
      options: currencies,
      multiple: true,
      initialValue: [],
    },
    {
      key: 'completion',
      label: 'By completion',
      options: [
        { value: 'complete', label: 'Complete' },
        { value: 'incomplete', label: 'Incomplete' },
        { value: '', label: 'All' },
      ],
      initialValue: '',
    },
  ];

  return (
    <FilterModal
      open={open}
      onClose={onClose}
      setFilter={setFilter}
      title="Filter Settings"
      filters={filters}
    />
  );
}