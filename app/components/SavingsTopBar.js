import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function SavingsTopBar({}) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Savings
          </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="filter"
        >
          <FilterAltIcon />
        </IconButton>
        <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="sort"
          >
            <SwapVertIcon />
        </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}