'use client';

import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import SavingsPage from "./pages/SavingsPage";
import SettingsPage from "./pages/SettingsPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import Navbar from "./components/Navbar";
import { GlobalProvider } from "./components/GlobalContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ClientOnly } from "./components/ClientOnly";

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={darkTheme}>
    <ClientOnly>
      <GlobalProvider>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'transactions' && <TransactionsPage />}
      {currentPage === 'currencies' && <CurrenciesPage />}
      {currentPage === 'savings' && <SavingsPage />}
      {currentPage === 'settings' && <SettingsPage />}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </GlobalProvider>
    </ClientOnly>
    </ThemeProvider>
    </LocalizationProvider>
  );
}