'use client';

import { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EditRecurringEntryModal from './EditRecurringEntryModal';

export default function RecurringEntry({ index, entryValues }) {
  const { value, currency, date, category, templateIndex } = entryValues;
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="mx-2 my-2">
      <EditRecurringEntryModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        entryValues={entryValues}
        templateIndex={templateIndex}
      />
      <Card variant="outlined">
        <CardActionArea onClick={() => setEditModalOpen(true)}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography sx={{ fontWeight: "bold", fontSize: 20 }} className="font-bold" component="div">
                  {value}{currency}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {date} - {category}
                </Typography>
              </div>
              <EventRepeatIcon />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}