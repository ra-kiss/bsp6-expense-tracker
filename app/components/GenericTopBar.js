'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function GenericTopBar({
  title,
  showFilter = false,
  onFilterClick,
  showSort = false,
  sortOptions = [],
  onSort,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (type, order) => {
    onSort?.(type, order);
    handleCloseMenu();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {showFilter && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="filter"
              onClick={onFilterClick}
            >
              <FilterAltIcon />
            </IconButton>
          )}

          {showSort && (
            <>
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
                {sortOptions.map((opt, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => handleSortClick(opt.type, opt.order)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
