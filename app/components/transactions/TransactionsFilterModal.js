'use client';

import FilterModal from '../FilterModal';
import { useGlobal } from '../GlobalContext';
import dayjs from 'dayjs';

export default function TransactionsFilterModal({ open, onClose, setFilter }) {
  const { categories, currencies } = useGlobal();

  const timeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: '14d', label: 'Last 14 Days' },
    { value: 'month', label: 'This Month' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'year', label: 'This Year' },
    { value: '', label: 'All time' },
  ];

  const filters = [
    {
      key: 'date',
      label: 'By time',
      options: timeOptions,
      initialValue: '',
      transform: (value) => {
        if (!value) return '';
        const today = dayjs();
        let dateLower, dateUpper;
        if (value === 'day') {
          dateLower = today;
          dateUpper = today;
        } else if (value === 'week') {
          dateLower = today.startOf('week');
          dateUpper = today.endOf('week');
        } else if (value === '14d') {
          dateLower = today.subtract(14, 'day');
          dateUpper = today;
        } else if (value === 'month') {
          dateLower = today.startOf('month');
          dateUpper = today.endOf('month');
        } else if (value === '30d') {
          dateLower = today.subtract(30, 'day');
          dateUpper = today;
        } else if (value === 'year') {
          dateLower = today.startOf('year');
          dateUpper = today.endOf('year');
        }
        const lowerDateString = dateLower
          ? dayjs(dateLower).startOf('day').format('D/M/YYYY')
          : '';
        const upperDateString = dateUpper
          ? dayjs(dateUpper).startOf('day').format('D/M/YYYY')
          : '';
        return lowerDateString && upperDateString ? [lowerDateString, upperDateString] : '';
      },
    },
    {
      key: 'currency',
      label: 'By currencies',
      options: currencies,
      multiple: true,
      initialValue: [],
    },
    {
      key: 'category',
      label: 'By categories',
      options: categories,
      multiple: true,
      initialValue: [],
    },
    {
      key: 'isIncome',
      label: 'By type',
      options: [
        { value: 'true', label: 'Income' },
        { value: 'false', label: 'Expense' },
      ],
      multiple: false,
      initialValue: '',
    },
  ];
  

  const handleSetFilter = (values) => {
    setFilter({
      category: values.category.length ? values.category : '',
      currency: values.currency.length ? values.currency : '',
      date: values.date ? filters[0].transform(values.date) : '',
      isIncome: values.isIncome !== '' ? values.isIncome : '',
    });
  };  

  return (
    <FilterModal
      open={open}
      onClose={onClose}
      setFilter={handleSetFilter}
      title="Filter Settings"
      filters={filters}
    />
  );
}