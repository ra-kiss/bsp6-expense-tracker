'use client';

import { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import HomeIcon from '@mui/icons-material/Home';
import PaymentsIcon from '@mui/icons-material/Payments';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Navbar() {
    const [value, setValue] = useState('transactions');
    
    // tba to onChange
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
        <div className="fixed bottom-0 w-screen">
            <BottomNavigation value={value}>
                <BottomNavigationAction
                label="Home"
                value="home"
                icon={<HomeIcon />}
                />
                <BottomNavigationAction
                label="Transactions"
                value="transactions"
                icon={<PaymentsIcon />}
                />
                <BottomNavigationAction
                label="Currencies"
                value="currencies"
                icon={<AttachMoneyIcon />}
                />
                <BottomNavigationAction
                label="Savings"
                value="savings"
                icon={<SavingsIcon />}
                />
                <BottomNavigationAction
                label="Settings"
                value="settings"
                icon={<SettingsIcon />}
                />
            </BottomNavigation>
        </div>
    );
  }