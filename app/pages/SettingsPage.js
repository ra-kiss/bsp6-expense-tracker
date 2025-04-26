'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import SettingsTopBar from '../components/settings/SettingsTopBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';

import CategoriesModal from '../components/settings/CategoriesModal';

export default function SettingsPage() {
  const theme = useTheme();

  const descriptionStyle = { color: 'text.secondary', fontSize: 13, maxWidth: 300 };
  
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    
  return (
    <>
      <SettingsTopBar/>
      <Box sx={{ ...theme.mixins.toolbar }} />
      <Box>
        <Card>
          <CardActionArea>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Main Currency
                  </Typography>
                  <Typography sx={descriptionStyle}>
                  Choose which currency is used to calculate exchange rates and display your dashboard
                  </Typography>
                </div>
                <MenuIcon/>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea onClick={() => setCategoriesModalOpen(true)}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Categories
                  </Typography>
                  <Typography sx={descriptionStyle}>
                  Add and remove transaction categories
                  </Typography>
                </div>
                <MenuIcon/>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>

        <CategoriesModal open={categoriesModalOpen} onClose={() => setCategoriesModalOpen(false)}/>
      </Box>
    </>
  );
}