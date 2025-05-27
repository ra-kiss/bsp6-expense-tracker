import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useGlobal } from '../GlobalContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function StatsModal({ open, onClose, stats }) {

  const {
    totalSpentThisWeek,
    totalSpentThisMonth,
    totalSpentAllTime,
    totalSavedAllTime,
    mostUsedCategoryThisWeek,
    mostUsedCategoryThisMonth,
    mostUsedCategoryAllTime,
    mostUsedCurrencyThisWeek,
    mostUsedCurrencyThisMonth,
    mostUsedCurrencyAllTime,
  } = stats;

  const { mainCurrency, currencies } = useGlobal();
  const mainCurrencyLabel = currencies.find(currency => currency.value === mainCurrency)?.label || 'Unknown';

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography sx={{fontWeight: 'bold'}} variant="h5" component="h2">
          More Statistics
        </Typography>
        <Card sx={{mt: 2}} variant="outlined">
        <CardContent>
        <Typography sx={{ fontSize: 20}}>
          Total Spent
        </Typography>
        <Typography sx={{ fontSize: 17, mt: 1 }}>
          This week you spent <Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{totalSpentThisWeek}{mainCurrencyLabel}</Typography>
        </Typography>
        <Typography sx={{ fontSize: 17 }}>
          This month you spent <Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{totalSpentThisMonth}{mainCurrencyLabel}</Typography>
        </Typography>
        <Typography sx={{ fontSize: 17 }}>
          Overall you spent <Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{totalSpentAllTime}{mainCurrencyLabel}</Typography>
        </Typography>
        </CardContent>
        </Card>
        <Card sx={{mt: 2}} variant="outlined">
        <CardContent>
        <Typography sx={{ fontSize: 20 }}>
          Total Saved
        </Typography>
        <Typography sx={{ fontSize: 17, mt: 1 }}>
          Overall you saved <Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{totalSavedAllTime}{mainCurrencyLabel}</Typography>
        </Typography>
        </CardContent>
        </Card>
        <Card sx={{mt: 2}} variant="outlined">
        <CardContent>
        <Typography sx={{ fontSize: 20 }}>
          Your most used category was...
        </Typography>
        <Typography sx={{ fontSize: 17, mt: 1 }}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCategoryThisWeek}</Typography> this week
        </Typography>
        <Typography sx={{ fontSize: 17}}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCategoryThisMonth}</Typography> this month
        </Typography>
        <Typography sx={{ fontSize: 17 }}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCategoryAllTime}</Typography> overall
        </Typography>
        </CardContent>
        </Card>
        <Card sx={{mt: 2}} variant="outlined">
        <CardContent>
        <Typography sx={{ fontSize: 20 }}>
          Your most used currency was...
        </Typography>
        <Typography sx={{ fontSize: 17, mt: 1 }}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCurrencyThisWeek}</Typography> this week
        </Typography>
        <Typography sx={{ fontSize: 17 }}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCurrencyThisMonth}</Typography> this month
        </Typography>
        <Typography sx={{ fontSize: 17 }}>
          ...<Typography component="span" sx={{fontWeight: 'bold', fontSize: 19}}>{mostUsedCurrencyAllTime}</Typography> overall
        </Typography>
        </CardContent>
        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}