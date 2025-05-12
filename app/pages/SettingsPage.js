'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import SettingsTopBar from '../components/settings/SettingsTopBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useGlobal } from '../components/GlobalContext';
import CategoriesModal from '../components/settings/CategoriesModal';

export default function SettingsPage() {
  const theme = useTheme();

  const descriptionStyle = { color: 'text.secondary', fontSize: 13, maxWidth: 300 };
  
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const { currencies, mainCurrency, setMainCurrency, budget, setBudget, budgetFrequency, setBudgetFrequency } = useGlobal();

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
                  <MenuItem value={"biweekly"}>
                    Every 2 Weeks
                  </MenuItem>
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

        <CategoriesModal open={categoriesModalOpen} onClose={() => setCategoriesModalOpen(false)}/>
      </Box>
    </>
  );
}