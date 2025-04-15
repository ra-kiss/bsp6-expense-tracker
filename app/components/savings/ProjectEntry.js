'use client';

import { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import CircularProgressWithLabel from '../CircluarProgressWithLabel';
import EditProjectEntryModal from "./EditProjectEntryModal";

export default function ProjectEntry({ index, entryValues }) {
  const { value, currency, goal, label } = entryValues;

  const [editProjectEntryModalOpen, setEditProjectEntryModalOpen] = useState(false);

  return (
    <div className="mx-2 my-2">
      <EditProjectEntryModal open={editProjectEntryModalOpen} setOpen={setEditProjectEntryModalOpen} entryValues={entryValues} index={index}/>
      <Card variant="outlined">
        <CardActionArea onClick={() => {
          setEditProjectEntryModalOpen(true);
        }}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
                  {label}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  <b>{value}</b>/{goal}{currency}
                </Typography>
              </div>
              <CircularProgressWithLabel variant="determinate" value={value/goal*100} />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}