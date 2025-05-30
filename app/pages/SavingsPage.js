'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import SavingsTopBar from '../components/savings/SavingsTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useGlobal } from '../components/GlobalContext';
import AddProjectEntryModal from '../components/savings/AddProjectEntryModal';
import SavingsFilterModal from '../components/savings/SavingsFilterModal';
import ProjectEntry from "../components/savings/ProjectEntry";

export default function SavingsPage() {
  const theme = useTheme();
  const { savingsProjects, setSavingsProjects } = useGlobal();
  const [addProjectEntryModalOpen, setAddProjectEntryModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    currency: '',
    completion: ''
  });

  const addEntry = (value, currency, goal, label) => {
    let curValue = value ? value : 0;
    let curGoal = goal ? goal : 0;
    let entryValues = { 'value': curValue, 'currency': currency, 'goal': curGoal, 'label': label };
    const newEntries = [entryValues, ...savingsProjects];
    setSavingsProjects(newEntries);
  };

  const sortProjects = (projects, type, order) => {
    let sorted;
    if (type === 'completion') {
      sorted = [...projects].sort((a, b) => {
        const progressA = a.goal != 0 ? a.value / a.goal * 100 : 0;
        const progressB = b.goal != 0 ? b.value / b.goal * 100 : 0;
        return order === 'asc' ? progressA - progressB : progressB - progressA;
      });
    }
    setSavingsProjects(sorted);
  };

  // Apply filters to savings projects
  const filteredProjects = savingsProjects.filter(project => {
    let matchesCurrency = true;
    let matchesCompletion = true;

    if (filter.currency && filter.currency.length > 0) {
      matchesCurrency = filter.currency.includes(project.currency);
    }

    if (filter.completion) {
      if (filter.completion === 'complete') {
        matchesCompletion = project.value >= project.goal;
      } else if (filter.completion === 'incomplete') {
        matchesCompletion = project.value < project.goal;
      }
    }

    return matchesCurrency && matchesCompletion;
  });

  return (
    <>
      <SavingsTopBar sortProjects={sortProjects} setFilterModalOpen={setFilterModalOpen} />
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((entry, index) => (
            <ProjectEntry key={index} index={index} entryValues={entry} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            No projects found.
          </Box>
        )}
        <AddProjectEntryModal open={addProjectEntryModalOpen} setOpen={setAddProjectEntryModalOpen} addEntry={addEntry} />
        <SavingsFilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} setFilter={setFilter} />
        <div className="fixed bottom-20 right-5 z-50">
          <Fab color="primary" aria-label="add" onClick={() => setAddProjectEntryModalOpen(true)}>
            <AddIcon />
          </Fab>
        </div>
      </Box>
    </>
  );
}