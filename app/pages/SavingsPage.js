'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function SavingsPage() {
  const theme = useTheme();

  return (
    <>
      {/* Placeholder for a future SavingsTopBar */}
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        <h1>Savings Page</h1>
        {/* Add savings-specific content here in the future */}
      </Box>
    </>
  );
}