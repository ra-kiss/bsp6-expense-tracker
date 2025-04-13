'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import SavingsTopBar from '../components/SavingsTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function SavingsPage() {
  const theme = useTheme();

  return (
    <>
      <SavingsTopBar/>
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        <div className="fixed bottom-20 right-5 z-50">
          <Fab color="primary" aria-label="add" onClick={}>
            <AddIcon />
          </Fab>
        </div>
      </Box>
    </>
  );
}