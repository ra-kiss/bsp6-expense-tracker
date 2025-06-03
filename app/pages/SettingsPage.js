'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import GenericTopBar from '../components/GenericTopBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TextField from '@mui/material/TextField';
import { useGlobal } from '../components/GlobalContext';
import CategoriesModal from '../components/settings/CategoriesModal';
import Alert from '@mui/material/Alert';


export default function SettingsPage() {
  const theme = useTheme();

  const descriptionStyle = { color: 'text.secondary', fontSize: 13, maxWidth: 300 };
  
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const { currencies, mainCurrency, setMainCurrency, budget, setBudget, budgetFrequency, setBudgetFrequency, exportDataToJson, importDataFromJson, showWarning } = useGlobal();

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Numbers and decimal only
    if (value.includes(".")) {
      let [dollars, cents] = value.split(".");
      cents = cents.slice(0, 2); // Max two decimal places
      value = dollars + "." + cents;
    }
    setBudget(value);
  };

  const handleBlur = () => {
    if (!budget || isNaN(parseFloat(budget)) || budget == "0") {
      setBudget("1");
    }
  };
  
  return (
    <>
      <GenericTopBar title="Settings" />
      <Box sx={{ ...theme.mixins.toolbar }} />
          {showWarning && (
          <Box sx={{ p: 1 }}>
            <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 10 }}>
              Warning: Based on your current spending rate, you may not have enough budget to meet your savings goals.
            </Alert>
          </Box>
          )}
      <Box>
        <Card>
          <CardActionArea>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Main Currency
                  </Typography>
                  <Typography sx={{...descriptionStyle, maxWidth: 250 }}>
                  Used for exchange rates and Home
                  </Typography>
                </div>
                <Select
                  value={mainCurrency}
                  onChange={(event) => setMainCurrency(event.target.value)}
                >
                  {currencies
                    .filter((currency) => !('custom' in currency))
                    .map((currency) => (
                      <MenuItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Income Frequency
                  </Typography>
                  <Typography sx={{...descriptionStyle, maxWidth: 250 }}>
                  How often to reset your Budget
                  </Typography>
                </div>
                <Select
                  sx={{ maxWidth: 130 }}
                  value={budgetFrequency}
                  onChange={(event) => setBudgetFrequency(event.target.value)}
                >
                  <MenuItem value={"monthly"}>
                    Monthly
                  </MenuItem>
                  {/* <MenuItem value={"biweekly"}>
                    Every 2 Weeks
                  </MenuItem> */}
                  <MenuItem value={"weekly"}>
                    Weekly
                  </MenuItem>
                </Select>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
        
        <Card>
          <CardActionArea>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Budget
                  </Typography>
                  <Typography sx={{...descriptionStyle, maxWidth: 250 }}>
                  How much is available to you each payment period
                  </Typography>
                </div>
                <TextField
                  variant="outlined"
                  type="text"
                  value={budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ maxWidth: 100 }}
                />
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

        <Card>
          <CardActionArea onClick={() => exportDataToJson()}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Export Data
                  </Typography>
                  <Typography sx={descriptionStyle}>
                  Export user data as JSON
                  </Typography>
                </div>
                <FileDownloadIcon/>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      
        <Card>
          <CardActionArea onClick={() => importDataFromJson()}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: 16 }} className="font-bold" component="div">
                    Import Data
                  </Typography>
                  <Typography sx={descriptionStyle}>
                  Import user data from JSON
                  </Typography>
                </div>
                <FileUploadIcon/>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>

        <CategoriesModal open={categoriesModalOpen} onClose={() => setCategoriesModalOpen(false)}/>
      </Box>
    </>
  );
}