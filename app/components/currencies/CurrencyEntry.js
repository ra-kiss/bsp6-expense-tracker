'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { useGlobal } from '../GlobalContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function CurrencyEntry({ index, entryValues, onClick }) {
  const { custom, valueInMain, label } = entryValues;
  const { currencies, mainCurrency } = useGlobal();

  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  return (
    <div className="mx-2 my-2">
      <Card variant="outlined">
        <CardActionArea onClick={custom ? onClick : undefined}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
                  <b>{label}</b>
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  1{label} = <b>{valueInMain}{mainCurrencyLabel}</b>
                </Typography>
              </div>
              {custom && <AutoAwesomeIcon />}
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}