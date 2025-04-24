'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import SavingsTopBar from '../components/savings/SavingsTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useGlobal } from '../components/GlobalContext';
import AddProjectEntryModal from '../components/savings/AddProjectEntryModal';

import ProjectEntry from "../components/savings/ProjectEntry";

export default function SavingsPage() {
  const theme = useTheme();
  const { savingsProjects, setSavingsProjects } = useGlobal();
  const [addProjectEntryModalOpen, setAddProjectEntryModalOpen] = useState(false);

  const addEntry = (value, currency, goal, label) => {
    let curValue = value ? value : 0;
    let curGoal = goal ? goal : 0;
    let entryValues = { 'value': curValue, 'currency': currency, 'goal': curGoal, 'label': label };
    const newEntries = [entryValues, ...savingsProjects];
    setSavingsProjects(newEntries);
  };

  return (
    <>
      <SavingsTopBar/>
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        {savingsProjects
          .map((entry, index) => {
            return <ProjectEntry key={index} index={index} entryValues={entry}/>;
          })
        }
        {/* <ProjectEntry entryValues={{value: 332, currency: '€ EUR', goal: 400, label: 'Test'}}/> */}
        <AddProjectEntryModal open={addProjectEntryModalOpen} setOpen={setAddProjectEntryModalOpen} addEntry={addEntry} />
        <div className="fixed bottom-20 right-5 z-50">
          <Fab color="primary" aria-label="add" onClick={() => setAddProjectEntryModalOpen(true)}>
            <AddIcon />
          </Fab>
        </div>
      </Box>
    </>
  );
}