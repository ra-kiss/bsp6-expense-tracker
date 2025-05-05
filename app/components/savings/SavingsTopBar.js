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
import { useGlobal } from '../GlobalContext';

export default function SavingsTopBar({ sortProjects }) {
  const { savingsProjects } = useGlobal();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSort = (type, order) => {
    sortProjects(savingsProjects, type, order);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Savings
          </Typography>
        {/* <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="filter"
        >
          <FilterAltIcon />
        </IconButton> */}
        <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="sort"
            onClick={handleMenu}
          >
            <SwapVertIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleSort('completion', 'desc')}>Sort by Completion (desc.)</MenuItem>
          <MenuItem onClick={() => handleSort('completion', 'asc')}>Sort by Completion (asc.)</MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}