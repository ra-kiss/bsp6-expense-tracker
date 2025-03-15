import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ListEntry() {
  return (
    <div className="mx-2 my-2">
        <Card>
        <CardContent>
            <Typography sx={{ fontWeight: "bold", fontSize: 20 }} className="font-bold" component="div">
            4.10$ USD
            </Typography>
            <div className="">
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>21/10/2021 - Groceries</Typography>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}