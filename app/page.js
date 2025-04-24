'use client';

import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TransactionsPage from "./pages/TransactionsPage";
import SavingsPage from "./pages/SavingsPage";
import Navbar from "./components/Navbar";

export default function Home() {
  const [currentPage, setCurrentPage] = useState('transactions');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {currentPage === 'transactions' && <TransactionsPage />}
      {currentPage === 'savings' && <SavingsPage />}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </LocalizationProvider>
  );
}