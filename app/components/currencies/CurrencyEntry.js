'use client';

import Typography from '@mui/material/Typography';
import { useGlobal } from '../GlobalContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BaseEntryCard from '../BaseEntryCard';

export default function CurrencyEntry({ index, entryValues, onClick }) {
  const { custom, valueInMain, label } = entryValues;
  const { currencies, mainCurrency } = useGlobal();

  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  return (
    <BaseEntryCard onClick={custom ? onClick : undefined}>
      {/* All unique content goes here */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography sx={{ fontSize: 20 }} className="font-bold" component="div">
            <b>{label}</b>
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            1{mainCurrencyLabel} = <b>{valueInMain}{label}</b>
          </Typography>
        </div>
        {custom && <AutoAwesomeIcon />}
      </div>
    </BaseEntryCard>
  );
}