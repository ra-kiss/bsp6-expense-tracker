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

import FilterModal from "./FilterModal";


export default function TransactionsTopBar({sortEntries, setFilter}) {
  const { entries } = useGlobal();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const handleClose = () => { setFilterModalOpen(false); }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSort = (type, order) => {
    sortEntries(entries, type, order);
    handleCloseMenu();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FilterModal open={filterModalOpen} setFilter={setFilter} onClose={handleClose}/>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Transactions
          </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="filter"
          onClick={() => { setFilterModalOpen(true); }}
        >
          <FilterAltIcon />
        </IconButton>
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
          <MenuItem onClick={() => handleSort('recency', 'desc')}>Sort by Recency (desc.)</MenuItem>
          <MenuItem onClick={() => handleSort('recency', 'asc')}>Sort by Recency (asc.)</MenuItem>
          <MenuItem onClick={() => handleSort('value', 'desc')}>Sort by Value (desc.)</MenuItem>
          <MenuItem onClick={() => handleSort('value', 'asc')}>Sort by Value (asc.)</MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}