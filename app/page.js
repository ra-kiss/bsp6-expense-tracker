'use client';

import Navbar from "./components/Navbar";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function Home(){
  return (
    <div>
      <div className="fixed bottom-20 right-5 z-50">
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
      <Navbar/>
    </div>
  );
}
