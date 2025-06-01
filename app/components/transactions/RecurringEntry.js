'use client';

import { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import NotesIcon from '@mui/icons-material/Notes';
import { useGlobal } from '../GlobalContext';
import EditRecurringEntryModal from './EditRecurringEntryModal';

export default function RecurringEntry({ index, entryValues, showDate = true }) {
  const { value, currency, date, category, notes, isIncome, templateIndex } = entryValues;
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { currencies } = useGlobal();
  const currencyLabel = currencies.find(c => c.value === currency)?.label || '';

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
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: isIncome ? 'success.main' : 'error.main'
                  }}
                  className="font-bold"
                  component="div"
                >
                  {isIncome ? "+" : "-"}{value}{currencyLabel}
                </Typography>
                <div>
                  {showDate && (
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {date} - {category}
                    </Typography>
                  )}
                  {!showDate && (
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {category}
                    </Typography>
                  )}
                </div>
                {notes && (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <NotesIcon sx={{ fontSize: 'small', color: 'text.secondary' }} />
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontSize: 14 }}>
                      {notes}
                    </Typography>
                  </div>
                )}
              </div>
              <EventRepeatIcon sx={{ fontSize: '1.5em', color: 'text.secondary', mr: 1 }} />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}