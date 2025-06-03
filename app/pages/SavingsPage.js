'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import GenericTopBar from '../components/GenericTopBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useGlobal } from '../components/GlobalContext';
import AddProjectEntryModal from '../components/savings/AddProjectEntryModal';
import SavingsFilterModal from '../components/savings/SavingsFilterModal';
import ProjectEntry from "../components/savings/ProjectEntry";
import Alert from '@mui/material/Alert';


export default function SavingsPage() {
  const theme = useTheme();
  const { savingsProjects, setSavingsProjects, showWarning } = useGlobal();
  const [addProjectEntryModalOpen, setAddProjectEntryModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    currency: '',
    completion: ''
  });

  const sortOptions = [
    { type: 'completion', order: 'desc', label: 'Sort by Completion (desc.)' },
    { type: 'completion', order: 'asc', label: 'Sort by Completion (asc.)' },
  ];


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
      <GenericTopBar
        title="Savings"
        showFilter
        showSort
        onFilterClick={() => setFilterModalOpen(true)}
        sortOptions={sortOptions}
        onSort={(type, order) => sortProjects(savingsProjects, type, order)}
      />
      <Box sx={{ ...theme.mixins.toolbar }} />
          {showWarning && (
          <Box sx={{ p: 1 }}>
            <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 10 }}>
              Warning: Based on your current spending rate, you may not have enough budget to meet your savings goals.
            </Alert>
          </Box>
          )}
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