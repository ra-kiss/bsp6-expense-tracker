'use client';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useGlobal } from '../GlobalContext';

export default function CurrenciesTopBar({ setFilterModalOpen }) {
  const { } = useGlobal();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Currencies
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="filter"
            onClick={() => setFilterModalOpen(true)}
          >
            <FilterAltIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}