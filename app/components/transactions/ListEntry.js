'use client';

import { useState } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useGlobal } from '../GlobalContext';

import EditListEntryModal from "./EditListEntryModal";


export default function ListEntry({index, entryValues}) {
  const { value, currency, date, category } = entryValues;

  const [editListEntryModalOpen, setEditListEntryModalOpen] = useState(false);

  const { currencies } = useGlobal();
  const currencyLabel = currencies.find(c => c.value === currency)?.label || '';

  return (
    <div className="mx-2 my-2">
        <EditListEntryModal open={editListEntryModalOpen} setOpen={setEditListEntryModalOpen} entryValues={entryValues} index={index}/>
        <Card variant="outlined">
        <CardActionArea onClick={() => {
          setEditListEntryModalOpen(true);
        }}>
        <CardContent>
            <Typography sx={{ fontWeight: "bold", fontSize: 20 }} className="font-bold" component="div">
            {value}{currencyLabel}
            </Typography>
            <div className="">
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{date} - {category}</Typography>
            </div>
        </CardContent>
        </CardActionArea>
        </Card>
    </div>
  );
}