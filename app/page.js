'use client';

import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TransactionsPage from "./pages/TransactionsPage";
import SavingsPage from "./pages/SavingsPage";
import SettingsPage from "./pages/SettingsPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import Navbar from "./components/Navbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Home() {
  const [currentPage, setCurrentPage] = useState('currencies');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={darkTheme}>
      {currentPage === 'transactions' && <TransactionsPage />}
      {currentPage === 'currencies' && <CurrenciesPage />}
      {currentPage === 'savings' && <SavingsPage />}
      {currentPage === 'settings' && <SettingsPage />}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </ThemeProvider>
    </LocalizationProvider>
  );
}