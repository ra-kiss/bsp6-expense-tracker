'use client';

import FilterModal from '../FilterModal';
import { useGlobal } from '../GlobalContext';

export default function CurrenciesFilterModal({ open, onClose, setFilter }) {
  const { currencies } = useGlobal();

  const filters = [
    {
      key: 'customStatus',
      label: 'By Custom Status',
      options: [
        { value: 'custom', label: 'Custom' },
        { value: 'builtin', label: 'Built-in' },
        // { value: '', label: 'All' },
      ],
      initialValue: '',
      multiple: false,
    },
  ];

  return (
    <FilterModal
      open={open}
      onClose={onClose}
      setFilter={setFilter}
      title="Filter Currencies"
      filters={filters}
    />
  );
}