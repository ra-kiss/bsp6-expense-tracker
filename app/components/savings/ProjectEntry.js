'use client';

import { useState } from "react";
import Typography from '@mui/material/Typography';
import CircularProgressWithLabel from '../CircluarProgressWithLabel';
import EditProjectEntryModal from "./EditProjectEntryModal";
import BaseEntryCard from "../BaseEntryCard";

export default function ProjectEntry({ index, entryValues }) {
  const { value, currency, goal, label } = entryValues;
  const [editProjectEntryModalOpen, setEditProjectEntryModalOpen] = useState(false);

  return (
    <>
      <EditProjectEntryModal open={editProjectEntryModalOpen} setOpen={setEditProjectEntryModalOpen} entryValues={entryValues} index={index}/>
      <BaseEntryCard onClick={() => setEditProjectEntryModalOpen(true)}>
        {/* All unique content goes here */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
              {label}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              <b>{value}</b>/{goal}{currency}
            </Typography>
          </div>
          <CircularProgressWithLabel variant="determinate" value={goal != 0 ? value / goal * 100 : 0} />
        </div>
      </BaseEntryCard>
    </>
  );
}